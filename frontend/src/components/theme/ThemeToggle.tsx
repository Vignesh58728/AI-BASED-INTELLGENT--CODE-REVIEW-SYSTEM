import { Moon, Sun, Monitor, Zap, Palette, Droplet } from "lucide-react"
import { Button } from "@/components/ui/Button"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/context/ThemeContext"

export function ThemeToggle() {
   const { setTheme } = useTheme()

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
               <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
               <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
               <span className="sr-only">Toggle theme</span>
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
               <Sun className="mr-2 h-4 w-4" />
               Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
               <Moon className="mr-2 h-4 w-4" />
               Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("oled")}>
               <Monitor className="mr-2 h-4 w-4" />
               OLED Black
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("cyberpunk")}>
               <Zap className="mr-2 h-4 w-4 text-cyan-400" />
               Cyberpunk
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dracula")}>
               <Palette className="mr-2 h-4 w-4 text-purple-400" />
               Dracula
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("solarized")}>
               <Droplet className="mr-2 h-4 w-4 text-yellow-600" />
               Solarized
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
               <Monitor className="mr-2 h-4 w-4" />
               System
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   )
}
