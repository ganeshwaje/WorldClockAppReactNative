import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TimeZoneItem {
  id: string;
  cityName: string;
  timeZone: string;
  offset: number;
  country: string;
}

interface ClockState {
  timeZones: TimeZoneItem[];
  isAddModalVisible: boolean;
}

const initialState: ClockState = {
  timeZones: [
    {
      id: '1',
      cityName: 'New York',
      timeZone: 'America/New_York',
      offset: -4,
      country: 'United States'
    },
    {
      id: '2',
      cityName: 'London',
      timeZone: 'Europe/London',
      offset: 1,
      country: 'United Kingdom'
    }
  ],
  isAddModalVisible: false,
};

const clockSlice = createSlice({
  name: 'clock',
  initialState,
  reducers: {
    addTimeZone: (state, action: PayloadAction<TimeZoneItem>) => {
      state.timeZones.push(action.payload);
    },
    removeTimeZone: (state, action: PayloadAction<string>) => {
      state.timeZones = state.timeZones.filter(tz => tz.id !== action.payload);
    },
    setAddModalVisible: (state, action: PayloadAction<boolean>) => {
      state.isAddModalVisible = action.payload;
    },
    reorderTimeZones: (state, action: PayloadAction<TimeZoneItem[]>) => {
      state.timeZones = action.payload;
    }
  },
});

export const { 
  addTimeZone, 
  removeTimeZone, 
  setAddModalVisible,
  reorderTimeZones 
} = clockSlice.actions;

export default clockSlice.reducer;