import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Box, Breadcrumbs, Center, Loader, SimpleGrid, Text, useMantineTheme } from "@mantine/core";
import { IconCard } from "src/components/Cards";
import { IconToolsKitchen, IconStars, IconSlideshow, IconChartDots } from "@tabler/icons";
import { AppShell } from "src/components/AppShell";
import { useRouter } from "next/router";
import { api } from "src/utils/api";
import { PublishButton } from "src/components/PublishButton";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { showErrorToast } from "src/utils/helpers";

/** Page to manage all the options under the restaurant */
const RestaurantManagePage: NextPage = () => {
    const router = useRouter();
    const theme = useMantineTheme();
    const [itemsParent] = useAutoAnimate<HTMLDivElement>();
    const restaurantId = router.query?.restaurantId as string;

    const { data: restaurant, isLoading } = api.restaurant.get.useQuery(
        { id: restaurantId },
        {
            enabled: !!restaurantId,
            onError: () => {
                showErrorToast("Failed to retrieve restaurant details");
                router.push("/restaurant");
            },
        }
    );

    return (
        <>
            <Head>
                <title>Menufic - Manage Restaurant</title>
                <meta name="description" content="Manage your restaurant's menus and banners" />
            </Head>
            <main>
                <AppShell>
                    <Box ref={itemsParent}>
                        {isLoading ? (
                            <Center w="100%" h="50vh">
                                <Loader size="lg" />
                            </Center>
                        ) : (
                            <>
                                <SimpleGrid
                                    breakpoints={[
                                        { minWidth: "sm", cols: 2 },
                                        { minWidth: "xs", cols: 1 },
                                    ]}
                                >
                                    <Breadcrumbs color={theme.black}>
                                        <Link href="/restaurant">Restaurant</Link>
                                        <Text>{restaurant?.name}</Text>
                                    </Breadcrumbs>
                                    {restaurant && <PublishButton restaurant={restaurant} />}
                                </SimpleGrid>
                                <SimpleGrid
                                    mt="xl"
                                    breakpoints={[
                                        { minWidth: "lg", cols: 3 },
                                        { minWidth: "sm", cols: 2 },
                                        { minWidth: "xs", cols: 1 },
                                    ]}
                                >
                                    <IconCard
                                        title="Menus"
                                        subTitle="Manage the menus, categories and individual menu items of your restaurant"
                                        Icon={IconToolsKitchen}
                                        href={`/restaurant/${router.query?.restaurantId}/edit-menu`}
                                    />
                                    <IconCard
                                        title="Banners"
                                        subTitle="Manage banners that could be used to display promotional content in your restaurant menu"
                                        Icon={IconSlideshow}
                                        href={`/restaurant/${router.query?.restaurantId}/banners`}
                                    />
                                    <IconCard
                                        title="Feedback (Coming Soon)"
                                        subTitle="View feedback received from your restaurant customers"
                                        Icon={IconStars}
                                    />
                                    <IconCard
                                        title="Stats (Coming Soon)"
                                        subTitle="Gain insights on how many people view your published menu and which items are most popular"
                                        Icon={IconChartDots}
                                    />
                                </SimpleGrid>
                            </>
                        )}
                    </Box>
                </AppShell>
            </main>
        </>
    );
};

export default RestaurantManagePage;