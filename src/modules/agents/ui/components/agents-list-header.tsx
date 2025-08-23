'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon, XCircleIcon } from 'lucide-react'
import { NewAgentDialog } from './new-agent-dialog'
import { useAgentsFilters } from '@/modules/agents/hooks/use-agents-filters'
import { AgentSearchFilter } from './agent-search-filter'
import { DEFAULT_PAGE } from '@/constants'

export const AgentsListHeader = () => {
    const [filters, setFilters] = useAgentsFilters()
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const isAnyFilterModifies = !! filters.search

    const onClearFilters = () => {
        setFilters({
            search: '',
            page: DEFAULT_PAGE
        })
    }

    return(
        <>
            <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
             <div className="py-4 px-4 md:px-8 flex items-center justify-between">
                <h5 className='font-medium text-xl'>My Agents</h5>
                <Button onClick={() => {setIsDialogOpen(true)}}>
                    <PlusIcon className="w-4 h-4 mr-2"/>
                    New Agents
                </Button>
            </div>
            <div className='flex items-center gap-x-2 p-1'>
                <AgentSearchFilter />
                {isAnyFilterModifies && (
                    <Button variant="outline" size="sm" onClick={onClearFilters}>
                        <XCircleIcon />
                        Clear
                    </Button>
                )}
            </div>
        </>
    )
}