import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';
import StorybookTheme from './storybook.theme';

addons.setConfig({
  theme: StorybookTheme
});