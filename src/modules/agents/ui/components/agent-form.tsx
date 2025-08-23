import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../../types";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { agentsInsertSchema } from "../../schemas";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import {Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

interface AgentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: AgentGetOne;
};

export const AgentForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: AgentFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();


  
  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
        onSuccess: async () => {
          await queryClient.invalidateQueries(
            trpc.agents.getMany.queryOptions({}),
          );
        // invalidate free tire usage
          onSuccess?.();
        },
        onError :(error) => {
          toast.message(error.message)
        },
    })
  )

  const updateAgent = useMutation(
    trpc.agents.update.mutationOptions({
        onSuccess: async () => {
          await queryClient.invalidateQueries(
            trpc.agents.getMany.queryOptions({}),
          );
          
          if (initialValues?.id) {
            await queryClient.invalidateQueries(
              trpc.agents.getOne.queryOptions({ id: initialValues.id }),
            );
          }
          onSuccess?.();
        },
        onError :(error) => {
          toast.message(error.message)
        },
    })
  )

  const form = useForm<z.infer<typeof agentsInsertSchema>>({
    resolver: zodResolver(agentsInsertSchema),
    defaultValues:{
        name: initialValues?.name ?? "",
        instructions: initialValues?.instructions ?? "",
    },
  })
  
  const isEdit = !!initialValues?.id;
  const isPending = createAgent.isPending || updateAgent.isPending;

  const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
    if (isEdit) {
      updateAgent.mutate({...values, id: initialValues.id})
    } else {
        createAgent.mutate(values);
    }
  };
  
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <GeneratedAvatar
          seed={form.watch("name")}
          variant="botttsNeutral"
          className="border size-16"
        />
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Agent Name - e.g, Math Tutor" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="instructions"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea 
                {...field} 
                placeholder="Agent Instructions - You are a helpful math tutor that can answers questions and can help with tasks." 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between gap-x-2">
          {onCancel && (
          <Button 
          variant='ghost' 
          disabled={isPending} 
          type="button" 
          onClick={() => onCancel()} > 
            Cancel
          </Button>
          )}
          <Button disabled={isPending} type="submit">
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );

}
