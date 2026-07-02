import * as React from "react"
import {
   Calculator,
   Settings,
   User,
   Zap,
   LogOut,
   Moon,
   Sun,
   Monitor,
   Palette,
   Droplet,
} from "lucide-react"
import { Command } from "cmdk"
import { useNavigate } from "react-router-dom"
import { useTheme } from "@/context/ThemeContext"

export function CommandMenu() {
   const [open, setOpen] = React.useState(false)
   const navigate = useNavigate()
   const { setTheme } = useTheme()

   // Toggle the menu when ⌘K is pressed
   React.useEffect(() => {
      const down = (e: KeyboardEvent) => {
         if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            setOpen((open) => !open)
         }
      }

      document.addEventListener("keydown", down)
      return () => document.removeEventListener("keydown", down)
   }, [])

   const runCommand = React.useCallback((command: () => void) => {
      setOpen(false)
      command()
   }, [])

   if (!open) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in-0">
         <div className="w-full max-w-[640px] shadow-2xl rounded-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <Command className="bg-popover text-popover-foreground border border-border shadow-md rounded-xl overflow-hidden h-full max-h-[500px]">
               <div className="flex items-center border-b px-3">
                  <Calculator className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <Command.Input
                     autoFocus
                     placeholder="Type a command or search..."
                     className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  />
               </div>

               <Command.List className="max-h-[350px] overflow-y-auto overflow-x-hidden p-2">
                  <Command.Empty className="py-6 text-center text-sm">No results found.</Command.Empty>

                  <Command.Group heading="Navigation">
                     <Command.Item
                        onSelect={() => runCommand(() => navigate("/profile"))}
                        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                     >
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                     </Command.Item>
                     <Command.Item
                        onSelect={() => runCommand(() => navigate("/settings"))}
                        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                     >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                     </Command.Item>
                  </Command.Group>

                  <Command.Separator className="my-1 h-px bg-border" />

                  <Command.Group heading="Theme">
                     <Command.Item onSelect={() => runCommand(() => setTheme("light"))} className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground">
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Light Mode</span>
                     </Command.Item>
                     <Command.Item onSelect={() => runCommand(() => setTheme("dark"))} className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground">
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Dark Mode</span>
                     </Command.Item>
                     <Command.Item onSelect={() => runCommand(() => setTheme("oled"))} className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground">
                        <Monitor className="mr-2 h-4 w-4" />
                        <span>OLED Black</span>
                     </Command.Item>
                     <Command.Item onSelect={() => runCommand(() => setTheme("cyberpunk"))} className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground">
                        <Zap className="mr-2 h-4 w-4 text-cyan-400" />
                        <span>Cyberpunk</span>
                     </Command.Item>
                     <Command.Item onSelect={() => runCommand(() => setTheme("dracula"))} className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground">
                        <Palette className="mr-2 h-4 w-4 text-purple-400" />
                        <span>Dracula</span>
                     </Command.Item>
                     <Command.Item onSelect={() => runCommand(() => setTheme("solarized"))} className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground">
                        <Droplet className="mr-2 h-4 w-4 text-yellow-600" />
                        <span>Solarized</span>
                     </Command.Item>
                  </Command.Group>
               </Command.List>
            </Command>
         </div>
      </div>
   )
}
