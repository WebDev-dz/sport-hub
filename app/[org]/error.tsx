"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  statusCode: number;
  title: string;
  description: string;
};

export default function Error({ statusCode, title, description }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 lg:w-1/3">
        <div className="bg-white dark:bg-black border-b py-2 flex justify-between items-center border-border">
          <div className="text-2xl font-bold text-blue-600">{title}</div>
        </div>

        <div className="p-4 text-center">
          <h1 className="text-3xl font-bold mb-4">{statusCode}</h1>
          <p className="text-lg mb-8">{description}</p>
          <Link href="/">
            <Button className="gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
