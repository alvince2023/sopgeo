import Link from "next/link";
import { Logo } from "@/components/shared/logo";

const footerLinks = {
  product: {
    title: "产品",
    links: [
      { label: "功能", href: "/features" },
      { label: "定价", href: "/pricing" },
      { label: "更新日志", href: "/blog" },
    ],
  },
  company: {
    title: "公司",
    links: [
      { label: "关于我们", href: "/about" },
      { label: "案例", href: "/cases" },
      { label: "联系我们", href: "mailto:hello@sopgeo.cn" },
    ],
  },
  legal: {
    title: "法律",
    links: [
      { label: "隐私政策", href: "/privacy" },
      { label: "服务条款", href: "/terms" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Logo className="mb-4" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              首个专注中文市场的AI搜索GEO平台。
              让品牌在豆包、DeepSeek、Kimi等
              AI引擎中被精准推荐。
            </p>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="font-medium text-sm mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SopGeo. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            为 AI 时代的品牌可见度而生
          </p>
        </div>
      </div>
    </footer>
  );
}
