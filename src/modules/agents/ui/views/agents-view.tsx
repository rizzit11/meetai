'use client'

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";
import { DataTable } from "@/components/data-table"
import { columns } from "../components/columns";
import { useAgentsFilters } from "@/modules/agents/hooks/use-agents-filters";
import { DataPagination } from "../components/data-pagination";
import {useRouter} from 'next/navigation'


export const AgentsView = () => {
    const router = useRouter()
    const [ filters, setFilters ] = useAgentsFilters()
    const trpc = useTRPC()
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filters,
    }))

    return(
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable 
                data={data.items} 
                columns={columns}
                onRowClick={(row)=> router.push(`/agents/${row.id}`)} 
            />
            <DataPagination 
                page={filters.page} 
                totalPages={data.totalPages} 
                onPageChange={(page) => setFilters({page})} 
            />
             {data.items.length === 0 && (
                <EmptyState title="Create your first agent" description="Create an agent to get started." /> 
            )}
        </div>
    )
}

export const AgentsViewLoading = () => {
    return (
        <LoadingState title="Loading" description="This may take a moment. Your agents are being loaded." />
    )
}

export const AgentsViewError = () => {
    return (
        <ErrorState title="Error Loading Agents" description="Something went wrong." />
    )
}
