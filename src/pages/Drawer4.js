import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';

import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import find from 'lodash/find';
import withRoot from '../withRoot';

import { Route } from 'react-router-dom'
import AppDrawer from './../modules/components/AppDrawer';

import Demo from './../grid-list/Gh3CardGLWrapper';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
});

const pages = [
  {
    pathname: '/repo1',
    children: [
      {
        pathname: '/repo1/view1',
      },
      {
        pathname: '/repo1/view2',
      },
      {
        pathname: '/repo1/view3',
      },
    ],
  },
  {
    pathname: '/repo2',
    children: [
      {
        pathname: '/repo2/view1',
      },
      {
        pathname: '/repo2/view2',
      },
      {
        pathname: '/repo2/view3',
      },
    ],
  },
  {
    pathname: '/repo3',
    children: [
      {
        pathname: '/repo3/view1',
      },
      {
        pathname: '/repo3/view2',
      },
      {
        pathname: '/repo3/view3',
      },
    ],
  },
  {
    pathname: '/',
    title: false,
  },
];

function findActivePage(currentPages, url) {
  const activePage = find(currentPages, page => {
    if (page.children) {
      return url.pathname.indexOf(page.pathname) === 0;
    }

    // Should be an exact match if no children
    return url.pathname === page.pathname;
  });

  if (!activePage) {
    return null;
  }

  // We need to drill down
  if (activePage.pathname !== url.pathname) {
    return findActivePage(activePage.children, url);
  }

  return activePage;
}

const ShowRepoView = ({ match }) => (
  <div>
    <h3>Repo: {match.params.repo}</h3>
    <h4>View: {match.params.view}</h4>
    <div>
      <Demo />
    </div>
  </div>
)

class Index extends React.Component {

  state = {
    mobileOpen: false,
  };

  getChildContext() {

    let myurl = {};
    myurl.pathname = this.props.history.location.pathname

    return {
      url: myurl ? myurl : null,
      pages,
      activePage: findActivePage(pages, myurl),
    };
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  render() {
    const { classes } = this.props;
    const title = 'Hola from Florida'
    let appBarClassName = classes.appBar;
    let navIconClassName = '';

    return (
      <div className={classes.root}>

        <AppBar className={appBarClassName}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerToggle}
              className={navIconClassName}
            >
              <MenuIcon />
            </IconButton>
            {title !== null && (
              <Typography className={classes.title} type="title" color="inherit" noWrap>
                {title}
              </Typography>
            )}
          </Toolbar>
        </AppBar>

        <AppDrawer
          className={classes.drawer}
          onClose={this.handleDrawerToggle}
          mobileOpen={this.state.mobileOpen}
          disablePermanent={false}
        />

        <Typography type="display1" gutterBottom>
          Florida
        </Typography>
        <Typography type="subheading" gutterBottom>
          has 20 million people...
        </Typography>

        <div style={{ flex: 1, padding: '10px' }}>
            <Route
              path="/:repo/:view"
              component={ShowRepoView}
            />
        </div>

      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

Index.childContextTypes = {
  url: PropTypes.object,
  pages: PropTypes.array,
  activePage: PropTypes.object,
};

export default withRoot(withStyles(styles)(Index));
