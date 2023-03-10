import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { Pokemon } from '../types/pokemon'
import { Box, Grid } from '@mui/material'
export const ItemCard = (props: Pokemon) => {
  const { id, url, name, types } = props
  return (
    <Card sx={{ width: 350, borderRadius: 7 }}>
      <Grid container direction="row" justifyContent="center" alignItems="center">
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
            <Typography variant="body2" color="text.secondary">
              No.{id}
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
              {name}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                p: 0,
                m: 0,
                bgcolor: 'background.paper',
                borderRadius: 1,
              }}
            >
              {types.map((t: string, i: number) => (
                <Grid item key={i} xs={6}>
                  <p>{t}</p>
                </Grid>
              ))}
            </Box>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}
