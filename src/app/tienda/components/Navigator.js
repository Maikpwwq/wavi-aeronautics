
import React from 'react'
// import PropTypes from 'prop-types'
import clsx from 'clsx'
import withRoot from '@/modules/withRoot'
import theme from '@/modules/theme'
// import { styled } from '@mui/material/styles'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import HomeIcon from '@mui/icons-material/Home'
import PeopleIcon from '@mui/icons-material/People'
import DnsRoundedIcon from '@mui/icons-material/DnsRounded'
import PermMediaOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActual'
import TimerIcon from '@mui/icons-material/Timer'
import SettingsIcon from '@mui/icons-material/Settings'
import PhonelinkSetupIcon from '@mui/icons-material/PhonelinkSetup'

const categories = [
  {
    id: 'Usuario',
    children: [
      { id: 'Tienda', icon: <PermMediaOutlinedIcon /> },
      { id: 'Pedidos', icon: <DnsRoundedIcon /> },
      { id: 'Datos de usuario', icon: <PeopleIcon />, active: true },
      { id: 'Ajustes', icon: <PhonelinkSetupIcon /> },
      { id: 'Seguridad', icon: <SettingsIcon /> }
    ]
  },
  {
    id: 'Administración',
    children: [
      { id: 'Usuarios registrados', icon: <PeopleIcon /> },
      { id: 'Rendimiento', icon: <TimerIcon /> },
      { id: 'Database', icon: <DnsRoundedIcon /> },
      { id: 'Ajustes', icon: <PhonelinkSetupIcon /> },
      { id: 'Seguridad', icon: <SettingsIcon /> }
    ]
  }
]

const styles = (theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover,&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)'
    }
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  firebase: {
    fontSize: 24,
    color: theme.palette.common.white
  },
  itemActiveItem: {
    color: '#4fc3f7'
  },
  itemPrimary: {
    fontSize: 'inherit'
  },
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2)
  },
  divider: {
    marginTop: theme.spacing(2)
  }
})

function Navigator (props) {
  const { ...other } = props
  const classes = props.classes
  const moreClasses = styles(theme)

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem sx={clsx(classes.firebase, classes.item, classes.itemCategory)}>
          Wavi Aeronautics
        </ListItem>
        <ListItem sx={clsx(classes.item, classes.itemCategory)}>
          <ListItemIcon sx={classes.itemIcon}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary
            }}
          >
            Descripción del proyecto
          </ListItemText>
        </ListItem>
        {categories.map(({ id, children }) => (
          <React.Fragment key={id}>
            <ListItem sx={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary
                }}
              >
                {id}
              </ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active }) => (
              <ListItem
                key={childId}
                button
                sx={(classes.item, active && classes.itemActiveItem)}
              >
                <ListItemIcon sx={classes.itemIcon}>{icon}</ListItemIcon>
                <ListItemText
                  classes={{
                    primary: classes.itemPrimary
                  }}
                >
                  {childId}
                </ListItemText>
              </ListItem>
            ))}

            <Divider sx={classes.divider} />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  )
}

Navigator.propTypes = {
  // classes: PropTypes.object.isRequired,
}

export default withRoot(Navigator)
