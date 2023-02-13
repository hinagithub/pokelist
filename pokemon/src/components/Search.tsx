import { Grid, InputAdornment, TextField } from "@mui/material"
import { useContext } from "react";
import { BsSearch } from "react-icons/bs";
import { SearchWordContext } from "../providers/SerchWordProvider";

export const Search = () => {
    const { searchWord, setSearchWord } = useContext(SearchWordContext)
    const handleChange = (event: any) => {
        console.log("event @Search.tsx", event.target.value)
        setSearchWord(event.target.value);
    }
    return (
        <Grid container
            direction="row"
            justifyContent="center"
            alignItems="center">
            <Grid item>
                <TextField
                    value={searchWord}
                    onChange={handleChange}
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
