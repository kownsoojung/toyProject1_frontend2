import { useModal } from "@/hooks/ModalProvider";
import useHelmetTitle from "@/hooks/useHelmet";

import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import Dashboard from "../Dashboard";

const System = () => {
    useHelmetTitle("System");
    
    const { openModal: openChildModal } = useModal();

      let fnModal = () =>{
        openChildModal("about-modal1", "About", "/Dashboard");
        }
    return (
        <Stack spacing={2}>
            <Button onClick={fnModal} >cc</Button>
            <Typography variant="h3" component={"h1"}>
                System
            </Typography>
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
            </Card>
        </Stack>
    );
};
export default System;
