export interface WidgetSettings {
  refreshInterval?: number;
  colorScheme?: 'default' | 'blue' | 'green' | 'purple';
  displayMode?: 'normal' | 'compact';
  density?: 'normal' | 'compact';
  pageSize?: number;
  chartType?: 'linear' | 'smooth' | 'grouped' | 'stacked';
  showLegend?: boolean;
}

export const defaultKPISettings: WidgetSettings = {
  refreshInterval: 60,
  colorScheme: 'default',
  displayMode: 'normal'
};

export const defaultChartSettings: WidgetSettings = {
  refreshInterval: 60,
  colorScheme: 'default',
  chartType: 'linear',
  showLegend: true
};

export const defaultBarChartSettings: WidgetSettings = {
  refreshInterval: 60,
  colorScheme: 'default',
  chartType: 'grouped',
  showLegend: true
};

export const defaultTableSettings: WidgetSettings = {
  refreshInterval: 60,
  colorScheme: 'default',
  density: 'normal',
  pageSize: 10
};