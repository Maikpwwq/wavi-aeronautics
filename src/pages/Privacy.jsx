import withRoot from 'modules/withRoot';
// --- Post bootstrap -----
import React from 'react';
// import ReactMarkdown from 'react-markdown'
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Markdown from 'modules/components/Markdown';
import Typography from 'modules/components/Typography';
import AppAppBar from 'modules/views/AppAppBar';
// import privacy from 'modules/views/privacy.md';
import AppFooter from 'modules/views/AppFooter';

function Privacy() {
  let [readable, setReadable] = useState({ md: "privacy" });

  // useEffect(() => {
  //   fetch(privacy)
  //     .then((res) => res.text())
  //     .then((md) => {
  //       console.log(md);
  //       setReadable({ md });
  //     });
  // }, [privacy]);

  return (
    <React.Fragment>
      <AppAppBar />
      <Container>
        <Box mt={7} mb={12}>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Privacy
          </Typography>
          {/* <ReactMarkdown>{readable.md}</ReactMarkdown> */}
          <Markdown>{readable.md}</Markdown>
        </Box>
      </Container>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(Privacy);