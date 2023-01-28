import { ActionIcon, createStyles, Text, Grid, Box } from "@mantine/core";
import type { Image, MenuItem } from "@prisma/client";
import { IconGripVertical, IconEdit, IconTrash } from "@tabler/icons";
import type { FC } from "react";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { api } from "src/utils/api";
import { DeleteConfirmModal } from "../../DeleteConfirmModal";
import { MenuItemForm } from "../../Forms/MenuItemForm";
import { ImageKitImage } from "../../ImageKitImage";
import { showErrorToast, showSuccessToast } from "src/utils/helpers";

const useStyles = createStyles((theme) => ({
    itemDragging: { background: theme.colors.dark[1], boxShadow: theme.shadows.sm },
    elementItem: {
        borderRadius: theme.radius.lg,
        transition: "background 500ms ease",
        [`&:hover`]: { background: theme.colors.dark[1] },
    },
    dragHandleTable: {
        ...theme.fn.focusStyles(),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: theme.colors.dark[6],
    },
    emptyImage: {
        height: 50,
        width: 50,
        borderRadius: theme.radius.md,
        border: `1px solid ${theme.colors.dark[2]}`,
        overflow: "hidden",
        verticalAlign: "center",
        textAlign: "center",
        fontSize: theme.fontSizes.xs,
        color: theme.colors.dark[5],
        display: "flex",
        alignItems: "center",
    },
    actionButtons: {
        display: "flex",
        justifyContent: "center",
        gap: 10,
    },
}));

interface Props {
    /** Item which will be represented by the component */
    menuItem: MenuItem & { image?: Image };
    /** Id of the menu to which the item belongs to  */
    menuId: string;
    /** Id of the Category to which the item belongs to */
    categoryId: string;
}

/** Individual menu item component with an option to edit or delete */
export const MenuItemElement: FC<Props> = ({ menuItem, menuId, categoryId }) => {
    const trpcCtx = api.useContext();
    const { classes, cx, theme } = useStyles();
    const [deleteMenuItemModalOpen, setDeleteMenuItemModalOpen] = useState(false);
    const [menuItemFormOpen, setMenuItemFormOpen] = useState(false);

    const { mutate: deleteMenuItem, isLoading: isDeleting } = api.menuItem.delete.useMutation({
        onSuccess: (data) => {
            trpcCtx.category.getAll.setData({ menuId }, (categories) =>
                categories?.map((item) =>
                    item.id === categoryId
                        ? {
                              ...item,
                              items: item.items?.filter((menuItem) => menuItem.id !== data.id),
                          }
                        : item
                )
            );
            showSuccessToast("Successfully deleted", `Deleted the menu item ${data.name}`);
        },
        onError: (err) => showErrorToast("Failed to delete menu item", err),
        onSettled: () => setDeleteMenuItemModalOpen(false),
    });

    return (
        <>
            <Draggable key={menuItem.id} index={menuItem.position} draggableId={menuItem.id}>
                {(provided, snapshot) => (
                    <Grid
                        gutter="lg"
                        my="sm"
                        align="center"
                        ref={provided.innerRef}
                        className={cx([classes.elementItem, snapshot.isDragging && classes.itemDragging])}
                        {...provided.draggableProps}
                    >
                        <Grid.Col
                            span={1}
                            sm={2}
                            md={1}
                            className={classes.dragHandleTable}
                            {...provided.dragHandleProps}
                        >
                            <IconGripVertical size={18} stroke={1.5} />
                        </Grid.Col>

                        <Grid.Col span={2} sm={2} md={1}>
                            <Box className={classes.emptyImage}>
                                {menuItem.image?.path ? (
                                    <ImageKitImage
                                        imagePath={menuItem.image?.path}
                                        height={50}
                                        width={50}
                                        imageAlt={menuItem.name}
                                        blurhash={menuItem.image?.blurHash}
                                        color={menuItem.image?.color}
                                    />
                                ) : (
                                    <Text>No Image</Text>
                                )}
                            </Box>
                        </Grid.Col>

                        <Grid.Col span={6} sm={5} md={2}>
                            <Text weight={700} align="center">
                                {menuItem.name}
                            </Text>
                        </Grid.Col>
                        <Grid.Col span={3} sm={3} md={2}>
                            <Text align="center" color="red" opacity={0.8}>
                                {menuItem.price}
                            </Text>
                        </Grid.Col>
                        <Grid.Col span={12} sm={9} lg={5}>
                            <Text color={menuItem.description ? theme.colors.dark[6] : theme.colors.dark[3]}>
                                {menuItem.description || "No Description"}
                            </Text>
                        </Grid.Col>
                        <Grid.Col span={12} sm={3} lg={1} className={classes.actionButtons}>
                            <ActionIcon onClick={() => setMenuItemFormOpen(true)}>
                                <IconEdit size={18} />
                            </ActionIcon>
                            <ActionIcon color="red" onClick={() => setDeleteMenuItemModalOpen(true)}>
                                <IconTrash size={18} />
                            </ActionIcon>
                        </Grid.Col>
                    </Grid>
                )}
            </Draggable>

            <DeleteConfirmModal
                opened={deleteMenuItemModalOpen}
                onClose={() => setDeleteMenuItemModalOpen(false)}
                onDelete={() => deleteMenuItem({ id: menuItem?.id })}
                loading={isDeleting}
                title={`Delete ${menuItem?.name} item`}
                description="Are you sure, you want to delete this menu item? This action cannot be undone"
            />

            <MenuItemForm
                opened={menuItemFormOpen}
                menuItem={menuItem}
                onClose={() => setMenuItemFormOpen(false)}
                menuId={menuId}
                categoryId={categoryId}
            />
        </>
    );
};