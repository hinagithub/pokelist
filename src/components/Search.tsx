import { InputAdornment, TextField } from "@mui/material"
import { BsSearch } from "react-icons/bs"
type Props = {
    searchWord: string,
    setSearchWord: (e: string) => void;
    handleKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void

};
export const Search = (props: Props) => {
    const { searchWord, setSearchWord, handleKeyUp } = props
    const execSetSearchWord = (e: any) => {
        setSearchWord(e)
    }

    const execHandleKeyUp = (e: any) => {
        handleKeyUp(e)
    }
    return (<TextField
        id="search"
        placeholder="search"
        variant="outlined"
        onChange={(e: { target: { value: string } }) =>
            execSetSearchWord(e.target.value)
        }
        onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) =>
            execHandleKeyUp(e)
        }
        InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                    <BsSearch size={40} />
                </InputAdornment>
            ),
        }}
        sx={{
            width: "80vw",
            pt: 10,
            pb: 5,
            "& .MuiInputBase-root": {
                height: 80,
                fontSize: 40,
                borderRadius: 10,
                px: 3,
            },
        }}
    ></TextField>)
}