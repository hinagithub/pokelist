import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Pokemon } from '../types/pokemon';
import { Grid } from '@mui/material';
export const ItemCard = (props: Pokemon) => {
    const { id, url, name, types } = props
    return (
        <Card sx={{ width: 350, borderRadius: '5%' }} >
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <CardMedia
                    sx={{
                        width: 150,
                        height: 150,
                    }}
                    image={url}
                    title="green iguana"
                />
                <Grid item xs={6}>
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">No.{id}</Typography>
                        <Typography gutterBottom variant="h5" component="div">{name}</Typography>
                        <Grid container spacing={2}>
                            {types.map((t) => (
                                <Grid item xs={3}>
                                    <p>{t}</p>
                                </Grid>
                            ))}
                        </Grid>

                    </CardContent>
                </Grid>
            </Grid >
        </Card >
    );
}