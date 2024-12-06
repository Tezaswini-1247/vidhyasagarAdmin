import * as React from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Main,
  Typography,
} from '@strapi/design-system';
import { useIntl } from 'react-intl';

/* -------------------------------------------------------------------------------------------------
 * HomePageCE
 * -----------------------------------------------------------------------------------------------*/

const HomePageCE = () => {
  const { formatMessage } = useIntl();

  return (
    <Main>
      <Box padding={10}>
        <Grid.Root>
          <Grid.Item col={8} s={12} direction="column" alignItems="stretch">
            <Box paddingLeft={6} paddingBottom={10}>
              <Flex direction="column" alignItems="flex-start" gap={5}>
                <Typography tag="h1" variant="alpha">
                  {formatMessage({
                    id: 'ai4Mahila.welcome.title',
                    defaultMessage: 'Welcome to AI4Mahila',
                  })}
                </Typography>
                <Typography variant="epsilon" textColor="neutral600">
                  {formatMessage({
                    id: 'ai4Mahila.welcome.text',
                    defaultMessage: 'AI4Mahila is dedicated to empowering women through Artificial Intelligence. Join us as we work towards transforming communities and providing innovative AI-driven solutions.',
                  })}
                </Typography>
                <Button size="L">
                  {formatMessage({
                    id: 'ai4Mahila.button.join',
                    defaultMessage: 'Join the Movement',
                  })}
                </Button>
              </Flex>
            </Box>
          </Grid.Item>
        </Grid.Root>
      </Box>
    </Main>
  );
};

/* -------------------------------------------------------------------------------------------------
 * HomePage
 * -----------------------------------------------------------------------------------------------*/

const HomePage = () => {
  return (
    <Main>
      <HomePageCE />
    </Main>
  );
};

export { HomePage, HomePageCE };
