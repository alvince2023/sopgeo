"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("请填写所有字段");
      return;
    }

    if (password.length < 8) {
      setError("密码至少需要8位字符");
      return;
    }

    setLoading(true);

    // Simulate signup — will replace with Supabase auth
    await new Promise((resolve) => setTimeout(resolve, 800));

    setLoading(false);
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo className="justify-center mb-6" />
          <h1 className="text-2xl font-bold tracking-tight">创建你的账户</h1>
          <p className="text-sm text-muted-foreground mt-2">
            免费开始，3分钟了解品牌AI可见度
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-card border border-border rounded-2xl p-8 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                姓名
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="你的姓名"
                className="w-full h-10 rounded-full border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                邮箱
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full h-10 rounded-full border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                密码
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少8位字符"
                className="w-full h-10 rounded-full border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <Button
              variant="gradient"
              className="w-full"
              size="lg"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  注册中...
                </>
              ) : (
                "免费注册"
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              注册即表示你同意我们的{" "}
              <Link href="/terms" className="text-brand-500 hover:underline">
                服务条款
              </Link>{" "}
              和{" "}
              <Link href="/privacy" className="text-brand-500 hover:underline">
                隐私政策
              </Link>
            </p>
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          已有账户？{" "}
          <Link href="/login" className="text-brand-500 hover:text-brand-600 font-medium">
            登录
          </Link>
        </p>
      </div>
    </div>
  );
}
