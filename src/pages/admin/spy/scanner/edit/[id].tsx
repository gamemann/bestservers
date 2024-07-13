import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin } from "@utils/auth";
import Meta from "@components/Meta";
import AdminMenu from "@components/admin/Menu";
import { Platform, Spy, SpyScanner } from "@prisma/client";
import { prisma } from "@server/db";
import ScannerForm from "@components/spy/forms/Scanner";
import NotFound from "@components/statements/NotFound";
import { ScannerWithRelations } from "~/types/Spy";

export default function Page ({
    authed,
    platforms,
    scanner
} : {
    authed: boolean
    platforms: Platform[]
    scanner: ScannerWithRelations
}) {
    return (
        <>
            <Meta

            />
            <Wrapper>
                {authed ? (
                    <AdminMenu current="spy">
                        {scanner ? (
                            <>
                                <h1>Add Spy Scanner!</h1>
                                <ScannerForm
                                    platforms={platforms}
                                    scanner={scanner}
                                />
                            </>
                        ) : (
                            <NotFound item="spy scanner" />
                        )}
                    </AdminMenu>
                ) : (
                    <NoPermissions />
                )}
            </Wrapper>
        </>
    );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getServerAuthSession(ctx);

    const { params } = ctx;
    const id = params?.id?.toString();

    const authed = isAdmin(session);

    let platforms: Platform[] = [];
    let scanner: ScannerWithRelations | null = null;

    if (authed && id) {
        platforms = await prisma.platform.findMany();
        
        scanner = await prisma.spyScanner.findFirst({
            where: {
                id: Number(id)
            },
            include: {
                platforms: true
            }
        })
    }

    return {
        props: {
            authed: authed,
            platforms: platforms,
            scanner: scanner
        }
    }
}