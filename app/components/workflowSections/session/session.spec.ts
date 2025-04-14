import {
  describe,
} from 'vitest';

describe.todo('Session Unit Tests');

/**
 * Session Modal - Test mounting/umounting, test different state(s) mounting/unmounting (such as create, load, export)
 *
 * Session Create - test validations (session name is required, session length is not longer than 40,
 * and session name doesn't already exist in previous sessions), test create button is only enabled
 * when there is a valid name, test create button shows a loading spinner when creating the session.
 *
 * Session Load - Edit, Delete, Load have all been combined into this component. Test only sessions for specific workflow
 * exist in the dropdowns. Test delete functionality - removed from lists. Test Editing name functionality with same
 * validations as create. Test load functionality (page transitions).
 *
 * Session Export - Test dropdowns of users (test users are selectable). Test export button enable/disable only if there
 * is a session selected to be exported and names have been selected in the grid. Test the strikethrough css feature -
 * if a user already has that session their name should not be selectable in the grid. Test the strikethrough feature after
 * a successfull load into that user.
 *
 */
