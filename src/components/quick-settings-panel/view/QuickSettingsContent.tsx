import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DarkModeToggle } from '../../../shared/view/ui';
import LanguageSelector from '../../../shared/view/ui/LanguageSelector';
import type { ChatRenderMode } from '../../../hooks/useUiPreferences';
import {
  INPUT_SETTING_TOGGLES,
  SETTING_ROW_CLASS,
  TOOL_DISPLAY_TOGGLES,
  VIEW_OPTION_TOGGLES,
} from '../constants';
import type {
  PreferenceToggleItem,
  PreferenceToggleKey,
  QuickSettingsPreferences,
} from '../types';
import QuickSettingsSection from './QuickSettingsSection';
import QuickSettingsToggleRow from './QuickSettingsToggleRow';

type QuickSettingsContentProps = {
  isDarkMode: boolean;
  preferences: QuickSettingsPreferences;
  onPreferenceChange: (key: PreferenceToggleKey, value: boolean) => void;
  chatRenderMode: ChatRenderMode;
  onChatRenderModeChange: (mode: ChatRenderMode) => void;
};

export default function QuickSettingsContent({
  isDarkMode,
  preferences,
  onPreferenceChange,
  chatRenderMode,
  onChatRenderModeChange,
}: QuickSettingsContentProps) {
  const { t } = useTranslation('settings');

  const renderToggleRows = (items: PreferenceToggleItem[]) => (
    items.map(({ key, labelKey, icon }) => (
      <QuickSettingsToggleRow
        key={key}
        label={t(labelKey)}
        icon={icon}
        checked={preferences[key]}
        onCheckedChange={(value) => onPreferenceChange(key, value)}
      />
    ))
  );

  return (
    <div className="flex-1 space-y-6 overflow-y-auto overflow-x-hidden bg-background p-4">
      <QuickSettingsSection title={t('quickSettings.sections.appearance')}>
        <div className={SETTING_ROW_CLASS}>
          <span className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
            {isDarkMode ? (
              <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            )}
            {t('quickSettings.darkMode')}
          </span>
          <DarkModeToggle />
        </div>
        <LanguageSelector compact />
      </QuickSettingsSection>

      <QuickSettingsSection title={t('appearanceSettings.chatRenderMode.title')}>
        <div className={SETTING_ROW_CLASS}>
          <span className="text-sm text-gray-900 dark:text-white">
            {t('appearanceSettings.chatRenderMode.label')}
          </span>
          <select
            value={chatRenderMode}
            onChange={(event) => onChatRenderModeChange(event.target.value as ChatRenderMode)}
            className="rounded-md border border-input bg-card px-2 py-1 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="lean">{t('appearanceSettings.chatRenderMode.options.lean')}</option>
            <option value="medium">{t('appearanceSettings.chatRenderMode.options.medium')}</option>
            <option value="debugging">{t('appearanceSettings.chatRenderMode.options.debugging')}</option>
          </select>
        </div>
        <p className="ml-3 text-xs text-gray-500 dark:text-gray-400">
          {t(`appearanceSettings.chatRenderMode.descriptions.${chatRenderMode}`)}
        </p>
        {renderToggleRows(TOOL_DISPLAY_TOGGLES)}
      </QuickSettingsSection>

      <QuickSettingsSection title={t('quickSettings.sections.viewOptions')}>
        {renderToggleRows(VIEW_OPTION_TOGGLES)}
      </QuickSettingsSection>

      <QuickSettingsSection title={t('quickSettings.sections.inputSettings')}>
        {renderToggleRows(INPUT_SETTING_TOGGLES)}
        <p className="ml-3 text-xs text-gray-500 dark:text-gray-400">
          {t('quickSettings.sendByCtrlEnterDescription')}
        </p>
      </QuickSettingsSection>
    </div>
  );
}
