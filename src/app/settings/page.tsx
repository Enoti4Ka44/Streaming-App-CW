import { getCurrentUserId } from "@/actions/authActions";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/settings-form";
import { getUserProfile } from "@/actions/settingsAction";

export default async function SettingsPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/");
  }

  const user = await getUserProfile();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto p-6 w-full text-center">
        <p className="text-muted-foreground mt-10">
          Ошибка: Пользователь не найден
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Настройки профиля</h1>
        <p className="text-muted-foreground mt-2">
          Здесь вы можете изменить основную информацию о вашем аккаунте и
          канале.
        </p>
      </div>

      <SettingsForm user={user} />
    </div>
  );
}
