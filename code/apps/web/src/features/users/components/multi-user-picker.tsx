"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X, User } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { searchUsersAction } from "@/features/users/actions/search-users"
import { useDebounce } from "@/hooks/use-debounce"

interface SelectedUser {
  id: string
  displayName: string
  email: string
  avatarUrl?: string | null
}

interface MultiUserPickerProps {
  selectedUsers: SelectedUser[]
  onChange: (users: SelectedUser[]) => void
  placeholder?: string
}

export function MultiUserPicker({
  selectedUsers,
  onChange,
  placeholder = "Search users...",
}: MultiUserPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SelectedUser[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const debouncedQuery = useDebounce(query, 300)

  React.useEffect(() => {
    const search = async () => {
      setIsSearching(true)
      try {
        const users = await searchUsersAction(debouncedQuery)
        setResults(users)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsSearching(false)
      }
    }
    search()
  }, [debouncedQuery])

  const toggleUser = (user: SelectedUser) => {
    const isSelected = selectedUsers.some((u) => u.id === user.id)
    if (isSelected) {
      onChange(selectedUsers.filter((u) => u.id !== user.id))
    } else {
      onChange([...selectedUsers, user])
    }
  }

  const removeUser = (userId: string) => {
    onChange(selectedUsers.filter((u) => u.id !== userId))
  }

  return (
    <div className="grid gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-10 py-2 px-3 hover:bg-background border-muted-foreground/20"
          >
            <div className="flex flex-wrap gap-1.5 items-center">
              {selectedUsers.length > 0 ? (
                selectedUsers.map((user) => (
                  <Badge
                    key={user.id}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1 pl-1.5 py-0.5 rounded-md bg-primary/5 text-primary border-primary/10"
                  >
                    <span className="text-[11px] font-medium">{user.displayName}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-primary/10 rounded-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeUser(user.id)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground font-normal">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Type to search users..."
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              {isSearching ? (
                <div className="p-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin border-2 border-primary border-t-transparent rounded-full" />
                  Searching...
                </div>
              ) : results.length === 0 ? (
                <CommandEmpty>No users found.</CommandEmpty>
              ) : null}
              <CommandGroup>
                {results.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.id}
                    onSelect={() => toggleUser(user)}
                    className="flex items-center gap-3 p-2 cursor-pointer"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      {user.avatarUrl ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatarUrl} />
                          <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                      ) : (
                        <User className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <span className="font-medium text-sm truncate">{user.displayName}</span>
                      <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    </div>
                    <div
                      className={cn(
                        "ml-auto h-4 w-4 flex items-center justify-center rounded-sm border border-primary/20",
                        selectedUsers.some((u) => u.id === user.id)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-transparent"
                      )}
                    >
                      {selectedUsers.some((u) => u.id === user.id) && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
