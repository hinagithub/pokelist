import { Grid, InputAdornment, TextField } from "@mui/material"
import { BsSearch } from "react-icons/bs";

export const Search = () => {
    return (
        <Grid container
            direction="row"
            justifyContent="center"
            alignItems="center">
            <Grid item>
                <TextField
                    sx={{
                        width: "80vw",
                        py: 10,
                        "& .MuiInputBase-root": {
                            height: 80,
                            fontSize: 40,
                            borderRadius: 10,
                            px: 3
                        }
                    }}
                    id="outlined-basic"
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <BsSearch size={40} />
                            </InputAdornment>
                        ),
                    }}>
                </TextField>
            </Grid >
        </Grid >
    )
}
