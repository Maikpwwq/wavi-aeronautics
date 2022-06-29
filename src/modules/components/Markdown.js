import React from "react";
import ReactMarkdown from "markdown-to-jsx";
import { styled } from "@mui/material/styles";
import { capitalize } from "@mui/material/utils";
import MuiTypography from "@mui/material/Typography";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
// import remarkGfm from 'remark-gfm';

const styles = (theme) => ({
  listItem: {
    marginTop: theme.spacing(1),
  },
});

const List = styled("ul")({});
const classes = styles(theme);

const options = {
  overrides: {
    h1: {
      component: (props) => <Typography gutterBottom variant="h4" {...props} />,
    },
    h2: {
      component: (props) => <Typography gutterBottom variant="h6" {...props} />,
    },
    h3: {
      component: (props) => (
        <Typography gutterBottom variant="subtitle1" {...props} />
      ),
    },
    h4: {
      component: (props) => (
        <Typography gutterBottom variant="caption" paragraph {...props} />
      ),
    },
    p: { component: (props) => <Typography paragraph {...props} /> },
    a: { component: Link },
    li: {
      component: (props) => (
        <List sx={classes.listItem}>
          <Typography component="span" {...props} />
        </List>
      ),
    },
  },
};

function Markdown(props) {
  return <ReactMarkdown {...props} />; // options={options} remarkPlugins={[remarkGfm]}
}

export default Markdown;
