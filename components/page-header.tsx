import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { NavUser } from "@/components/nav-user";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemData {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  breadcrumbs: BreadcrumbItemData[];
  user: {
    name: string;
    email: string;
  };
  actions?: React.ReactNode;
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}

export function PageHeader({ breadcrumbs, user, actions }: PageHeaderProps) {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              const displayLabel = truncateText(item.label, 15);

              return (
                <Fragment key={index}>
                  {index > 0 ? <BreadcrumbSeparator /> : null}
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{displayLabel}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={item.href ?? "/"} className="flex items-center gap-2">
                          {item.href === "/" ? (
                            <Image
                              src="/chef.png"
                              alt={displayLabel}
                              width={32}
                              height={32}
                            />
                          ) : displayLabel}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-2">
          {actions}
          <NavUser user={user} />
        </div>
      </div>
    </header>
  );
}
