import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin } from "@utils/auth";
import Meta from "@components/Meta";
import AdminMenu from "@components/admin/Menu";
import SpyBlock from "@components/spy/SpyBlock";
import ScannerBlock from "@components/spy/ScannerBlock";
import BadWordsBlock from "@components/spy/BadWordBlock";
import { ContentItem2 } from "@components/Content";
import BadIpsBlock from "@components/spy/BadIpBlock";
import BadAsnsBlock from "@components/spy/BadAsnBlock";
import GoodIpsBlock from "@components/spy/GoodIpBlock";

export default function Page ({
    authed    
} : {
    authed: boolean
}) {
    return (
        <>
            <Meta
                title={`${authed ? "Admin - Spy" : "No Permission"} - Best Servers`}
            />
            <Wrapper>
                {authed ? (
                    <AdminMenu current="spy">
                        <div className="flex gap-6 justify-between">
                            <div className="w-full flex flex-col gap-2">
                                <ContentItem2 title="Spies">
                                    <SpyBlock />
                                </ContentItem2>
                                <ContentItem2 title="Scanners">
                                    <ScannerBlock />
                                </ContentItem2>
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <ContentItem2 title="Bad Words">
                                    <BadWordsBlock />
                                </ContentItem2>
                                <ContentItem2 title="Bad IPs">
                                    <BadIpsBlock />
                                </ContentItem2>
                                <ContentItem2 title="Bad ASNs">
                                    <BadAsnsBlock />
                                </ContentItem2>
                                <ContentItem2 title="Good IPs">
                                    <GoodIpsBlock />
                                </ContentItem2>
                            </div>
                        </div>
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

    const authed = isAdmin(session);

    return {
        props: {
            authed: authed
        }
    }
}