import { useModal } from "@/hooks/ModalProvider";
import useHelmetTitle from "@/hooks/useHelmet";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";

const Dashboard = () => {
    const { openModal: openChildModal } = useModal();

    useHelmetTitle("HOME");
    const fnModal = () => {
        openChildModal({key: "about-modal", title: "About", pagePath: "/Settings/System", props: {param:"1"}, width: 1000, height: 600});
    };
    return (
        <Stack spacing={2}>
            <Typography variant="h3" component={"h1"}>
                Dashboard
            </Typography>
                <Button onClick={fnModal} >dd</Button>
            <Card>
                <CardContent>
                    <Typography paragraph>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ab magnam ullam a recusandae aperiam cupiditate
                        doloribus similique! Suscipit numquam reiciendis
                        voluptate omnis, ut sed dolorum facere cum ad nostrum
                        quas accusamus rem, optio laboriosam. Nesciunt fuga
                        impedit facere asperiores dolores reiciendis culpa nulla
                        voluptate? Iste tempora architecto excepturi explicabo?
                        Eveniet officiis quasi accusantium minus atque numquam
                        vel doloremque recusandae nobis. Consequatur tenetur qui
                        iste vitae voluptates, veritatis amet inventore veniam
                        doloremque fugit vero, eum aliquam voluptatibus officia
                        in unde! Mollitia, harum amet! Ab vero, quasi maxime
                        fugiat deleniti repudiandae ut consequatur pariatur
                        beatae officia reiciendis ipsa cupiditate nemo iusto
                        dolorem.
                    </Typography>
                </CardContent>
                <CardContent>
                    <Typography paragraph>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ab magnam ullam a recusandae aperiam cupiditate
                        doloribus similique! Suscipit numquam reiciendis
                        voluptate omnis, ut sed dolorum facere cum ad nostrum
                        quas accusamus rem, optio laboriosam. Nesciunt fuga
                        impedit facere asperiores dolores reiciendis culpa nulla
                        voluptate? Iste tempora architecto excepturi explicabo?
                        Eveniet officiis quasi accusantium minus atque numquam
                        vel doloremque recusandae nobis. Consequatur tenetur qui
                        iste vitae voluptates, veritatis amet inventore veniam
                        doloremque fugit vero, eum aliquam voluptatibus officia
                        in unde! Mollitia, harum amet! Ab vero, quasi maxime
                        fugiat deleniti repudiandae ut consequatur pariatur
                        beatae officia reiciendis ipsa cupiditate nemo iusto
                        dolorem.
                    </Typography>
                </CardContent>
                <CardContent>
                    <Typography paragraph>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ab magnam ullam a recusandae aperiam cupiditate
                        doloribus similique! Suscipit numquam reiciendis
                        voluptate omnis, ut sed dolorum facere cum ad nostrum
                        quas accusamus rem, optio laboriosam. Nesciunt fuga
                        impedit facere asperiores dolores reiciendis culpa nulla
                        voluptate? Iste tempora architecto excepturi explicabo?
                        Eveniet officiis quasi accusantium minus atque numquam
                        vel doloremque recusandae nobis. Consequatur tenetur qui
                        iste vitae voluptates, veritatis amet inventore veniam
                        doloremque fugit vero, eum aliquam voluptatibus officia
                        in unde! Mollitia, harum amet! Ab vero, quasi maxime
                        fugiat deleniti repudiandae ut consequatur pariatur
                        beatae officia reiciendis ipsa cupiditate nemo iusto
                        dolorem.
                    </Typography>
                </CardContent>
                <CardContent>
                    <Typography paragraph>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ab magnam ullam a recusandae aperiam cupiditate
                        doloribus similique! Suscipit numquam reiciendis
                        voluptate omnis, ut sed dolorum facere cum ad nostrum
                        quas accusamus rem, optio laboriosam. Nesciunt fuga
                        impedit facere asperiores dolores reiciendis culpa nulla
                        voluptate? Iste tempora architecto excepturi explicabo?
                        Eveniet officiis quasi accusantium minus atque numquam
                        vel doloremque recusandae nobis. Consequatur tenetur qui
                        iste vitae voluptates, veritatis amet inventore veniam
                        doloremque fugit vero, eum aliquam voluptatibus officia
                        in unde! Mollitia, harum amet! Ab vero, quasi maxime
                        fugiat deleniti repudiandae ut consequatur pariatur
                        beatae officia reiciendis ipsa cupiditate nemo iusto
                        dolorem.
                    </Typography>
                </CardContent>
                <CardContent>
                    <Typography paragraph>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ab magnam ullam a recusandae aperiam cupiditate
                        doloribus similique! Suscipit numquam reiciendis
                        voluptate omnis, ut sed dolorum facere cum ad nostrum
                        quas accusamus rem, optio laboriosam. Nesciunt fuga
                        impedit facere asperiores dolores reiciendis culpa nulla
                        voluptate? Iste tempora architecto excepturi explicabo?
                        Eveniet officiis quasi accusantium minus atque numquam
                        vel doloremque recusandae nobis. Consequatur tenetur qui
                        iste vitae voluptates, veritatis amet inventore veniam
                        doloremque fugit vero, eum aliquam voluptatibus officia
                        in unde! Mollitia, harum amet! Ab vero, quasi maxime
                        fugiat deleniti repudiandae ut consequatur pariatur
                        beatae officia reiciendis ipsa cupiditate nemo iusto
                        dolorem.
                    </Typography>
                </CardContent>
            </Card>
        </Stack>
    );
};
export default Dashboard;
