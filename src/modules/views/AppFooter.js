import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { styled } from '@mui/material/styles'
import withRoot from '../withRoot'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '../components/Typography'
// import TextField from '../components/TextField'
import theme from '../theme'
// import appFooterFacebook from "public/static/themes/appFooterFacebook.png";
// import appFooterTwitter from "public/static/themes/appFooterTwitter.png";
import appFooterLinkedin from 'public/static/themes/appFooterLinkedin.png'

const appFooterFacebook =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2Ficonos%2FappFooterFacebook.png?alt=media&token=b54b1ff2-c2b3-4d57-a7fa-c2e0e06d150e'
// const appFooterLinkedin =
// ('https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2Ficonos%2FappFooterLinkedin.png?alt=media&token=d1475fcd-9ae1-4c3c-84f5-ee38d76c2da6')

const SocialIcons = styled('a')(({ theme }) => ({
  width: 48,
  height: 48,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.warning.main,
  marginRight: 1,
  '&:hover': {
    backgroundColor: theme.palette.warning.dark
  }
}))

const LegalItem = styled('li')({
  paddingTop: 0.5,
  paddingBottom: 0.5,
  color: 'white'
})

const LegalDocuments = styled('ul')({
  margin: 0,
  listStyle: 'none',
  padding: 0
})

// language: {
//   marginTop: theme.spacing(1),
//   width: 150,
// },
// const LANGUAGES = [
//   {
//     code: 'en-US',
//     name: 'English',
//   },
//   {
//     code: 'fr-FR',
//     name: 'Français',
//   },
// ];

const styles = (theme) => ({
  link: {
    fontSize: '21px',
    textDecoration: 'none',
    color: 'white'
  }
})

function AppFooter (props) {
  // const { theme } = props; // dont need this anymore
  const classes = styles(theme)

  function Copyright () {
    return (
      <React.Fragment>
        <Link
          href="https://maikpwwq.github.io/wavi-aeronautics/"
          style={{ color: '#fff5f8' }}
        >
          Wavi Aeronautics {'© '}
          {new Date().getFullYear()}
        </Link>
      </React.Fragment>
    )
  }

  return (
    <Typography
      component="footer"
      sx={{
        display: 'flex',
        backgroundColor: '#1e1e1f'
      }}
    >
      <Container
        sx={{
          marginTop: 8,
          marginBottom: 8,
          display: 'flex'
        }}
      >
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6} md={4}>
            <Grid
              container
              direction="column"
              justifyContent="flex-end"
              sx={{
                height: 120
              }}
              spacing={2}
            >
              <Grid
                item
                sx={{
                  display: 'flex'
                }}
              >
                <SocialIcons href="https://www.facebook.com/wavi.aeronautics/">
                  <Image
                    src={appFooterFacebook}
                    alt="Facebook"
                    width={14}
                    height={28}
                    priority
                  />
                </SocialIcons>
                <SocialIcons href="https://www.linkedin.com/company/wavi-aeronautics/">
                  <Image
                    src={appFooterLinkedin}
                    width={28}
                    height={28}
                    alt="Linkedin"
                    priority
                  />
                </SocialIcons>
              </Grid>
              <Grid item>
                <Copyright />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              className="textWhite"
              sx={classes.link}
              variant="h6"
              marked="left"
              gutterBottom
            >
              Legal
            </Typography>
            <LegalDocuments>
              <LegalItem>
                <Link href="/terms/" className="textWhite" sx={classes.link}>
                  {'Terminos'}
                </Link>
              </LegalItem>
              <LegalItem>
                <Link href="/privacy/" className="textWhite" sx={classes.link}>
                  {'Privacidad'}
                </Link>
              </LegalItem>
            </LegalDocuments>
          </Grid>
          {/* <Grid item xs={6} sm={8} md={4}>
            <Typography variant="h6" marked="left" gutterBottom>
              Lenguaje
            </Typography>
            <TextField
              select
              SelectProps={{
                native: true,
              }}
              sx={classes.language}
            >
              {LANGUAGES.map((language) => (
                <option value={language.code} key={language.code}>
                  {language.name}
                </option>
              ))}
            </TextField>
          </Grid> */}
          {/* <Grid item>
            <Typography variant="caption">
              {"Icons made by "}
              <Link
                href="https://www.freepik.com"
                rel="sponsored"
                title="Freepik"
              >
                Freepik
              </Link>
              {" from "}
              <Link
                href="https://www.flaticon.com"
                rel="sponsored"
                title="Flaticon"
              >
                www.flaticon.com
              </Link>
              {" is licensed by "}
              <Link
                href="https://creativecommons.org/licenses/by/3.0/"
                title="Creative Commons BY 3.0"
                target="_blank"
                rel="noopener noreferrer"
              >
                CC 3.0 BY
              </Link>
            </Typography>
          </Grid> */}
        </Grid>
      </Container>
    </Typography>
  )
}

export default withRoot(AppFooter)
