import { type NextPage } from "next";
import Head from "next/head";
import { SimpleGrid, Title, Text, Loader, Center, Box, useMantineTheme } from "@mantine/core";
import { AppShell } from "src/components/AppShell";
import { ImageCard } from "src/components/Cards";
import { api } from "src/utils/api";
import { Empty } from "src/components/Empty";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { showErrorToast } from "src/utils/helpers";

/** Page that will allow logged in users to view all of the published restaurant menus */
const ExplorePage: NextPage = () => {
    const theme = useMantineTheme();
    const { data: restaurants = [], isLoading } = api.restaurant.getAllPublished.useQuery(undefined, {
        onError: () => showErrorToast("Failed to retrieve published restaurants"),
    });
    const [itemsParent] = useAutoAnimate<HTMLDivElement>();
    return (
        <>
            <Head>
                <title>Menufic - Explore restaurants</title>
                <meta name="description" content="Explore restaurants created and published by others" />
            </Head>
            <main>
                <AppShell>
                    <Title order={1}>Explore Restaurants</Title>
                    <Text color={theme.colors.dark[6]}>Following are the restaurants published by all users</Text>
                    <Box ref={itemsParent}>
                        <SimpleGrid
                            mt="xl"
                            breakpoints={[
                                { minWidth: "lg", cols: 3 },
                                { minWidth: "sm", cols: 2 },
                                { minWidth: "xs", cols: 1 },
                            ]}
                        >
                            {restaurants?.map((item) => (
                                <ImageCard
                                    key={item.id}
                                    image={item.image}
                                    href={`/restaurant/${item.id}/menu`}
                                    title={item.name}
                                    subTitle={item.location}
                                    target="_blank"
                                />
                            ))}
                        </SimpleGrid>
                        {isLoading && (
                            <Center w="100%" h="50vh">
                                <Loader size="lg" />
                            </Center>
                        )}
                        {!isLoading && restaurants?.length === 0 && (
                            <Empty text="There aren't any published restaurants" height="50vh" />
                        )}
                    </Box>
                </AppShell>
            </main>
        </>
    );
};

export default ExplorePage;