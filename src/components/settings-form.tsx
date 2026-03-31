"use client";

import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { User } from "@/types/user";
import { updateUserProfile } from "@/actions/settingsAction";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { countries } from "@/lib/data";

export default function SettingsForm({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState(false);
  const [country, setCountry] = useState(user.country);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: null, message: "" });

    const formData = new FormData(e.currentTarget);
    formData.set("country", country);
    try {
      await updateUserProfile(formData);
      setStatus({
        type: "success",
        message: "Настройки профиля успешно сохранены!",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: "Произошла ошибка при сохранении данных.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-2xl bg-card border rounded-xl p-6 shadow-sm"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Имя пользователя (Username)
        </label>
        <Input
          name="username"
          required
          defaultValue={user.username}
          placeholder="Например: Иван Иванов"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          name="email"
          type="email"
          required
          defaultValue={user.email}
          placeholder="your@email.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Страна</label>
        <Select
          name="country"
          defaultValue={user.country}
          onValueChange={setCountry}
          value={country}
        >
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Выберите страну" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {countries.map((country, i) => (
                <SelectItem value={country} key={i}>
                  {country}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Описание канала</label>
        <Textarea
          name="channel_description"
          rows={5}
          defaultValue={user.channel_description || ""}
          placeholder="Расскажите зрителям, о чем ваш канал..."
        />
      </div>

      {status.type === "success" && (
        <div className="p-3 bg-green-500/10 text-green-600 border border-green-500/20 rounded-lg flex items-center text-sm">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          {status.message}
        </div>
      )}

      {status.type === "error" && (
        <div className="p-3 bg-red-500/10 text-red-600 border border-red-500/20 rounded-lg flex items-center text-sm">
          <AlertCircle className="h-4 w-4 mr-2" />
          {status.message}
        </div>
      )}

      <div className="pt-2 border-t flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Сохранение..." : "Сохранить изменения"}
        </Button>
      </div>
    </form>
  );
}
