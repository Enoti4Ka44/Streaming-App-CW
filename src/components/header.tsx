"use client";
import Link from "next/link";
import { Search, User, LogOut, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { loginAsUser, logout } from "@/actions/authActions";
import { useRouter } from "next/navigation";

interface UserInfo {
  user_id: number;
  username: string;
}

export default function Header({
  allUsers,
  currentUserId,
}: {
  allUsers: UserInfo[];
  currentUserId: number | null;
}) {
  const currentUser = allUsers.find((u) => u.user_id === currentUserId);
  const router = useRouter();

  const handleUserChange = async (userId: number) => {
    await loginAsUser(userId);

    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tighter mr-6"
        >
          <span>
            YouTube<span className="text-red-600">DB</span>
          </span>
        </Link>

        <div className="flex-1 max-w-md mx-auto hidden md:flex relative">
          <Input
            placeholder="Поиск видео..."
            className="pl-10 rounded-full bg-secondary/50 border-none"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 flex gap-2 items-center rounded-full px-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {currentUser ? (
                      currentUser.username[0].toUpperCase()
                    ) : (
                      <User size={18} />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-medium leading-none">
                    {currentUser ? currentUser.username : "Войти"}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>Мой канал</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/studio">Личный кабинет</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings">Настройки</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Сменить аккаунт</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {allUsers.slice(0, 5).map((user) => (
                <DropdownMenuItem
                  key={user.user_id}
                  onClick={() => handleUserChange(user.user_id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  {user.username}
                  {user.user_id === currentUserId && (
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                  )}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logout()}
                className="text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Выйти</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
