import React, { FC } from "react";
import Head from "next/head";
import { Navbar, SideBar } from "../ui";

interface Props {
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
}
export const ShopLayout: FC<Props> = ({
  title,
  pageDescription,
  imageFullUrl,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={pageDescription} />
        {/* //metatags que usan redes sociales para mostrar nuestro contenido */}
        <meta name="og:title" content={title} />
        <meta name="og:description" content={pageDescription} />

        {imageFullUrl && <meta name="og:image" content={imageFullUrl} />}
      </Head>
      <nav>
        <Navbar />
      </nav>
      <SideBar />
      <main
        style={{ margin: "80px auto", maxWidth: "1440px", padding: "0px 30px" }}
      >
        {children}
      </main>
      <footer>{/* TODO fcustom footer */}</footer>
    </>
  );
};
