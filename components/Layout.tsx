import { Inter } from 'next/font/google'
import {PropsWithChildren} from "react";
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] })

export default function Layout({ children  }: PropsWithChildren<any>) {
  return (
    <>
      <Head>
        <title>Target Product</title>
      </Head>
      <main
        className={`flex min-h-screen items-center flex-col gap-8 p-24 px-3 md:px-5 ${inter.className}`}
      >
        {children}
      </main>
    </>
  )
}
