import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export default function SignupPage() {
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

        <div className="bg-card border border-border rounded-2xl p-8 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">
              姓名
            </label>
            <input
              id="name"
              type="text"
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
              placeholder="至少8位字符"
              className="w-full h-10 rounded-full border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>

          <Button variant="gradient" className="w-full" size="lg">
            免费注册
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
