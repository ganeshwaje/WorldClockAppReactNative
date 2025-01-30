// src/store/clockSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TimeZoneItem {
  id: string;
  cityName: string;
  timeZone: string;
  offset: number;
}

interface ClockState {
  timeZones: TimeZoneItem[];
  isAddModalVisible: boolean;
}

const initialState: ClockState = {
  timeZones: [
    {
      id: '1',
      cityName: 'San Francisco',
      timeZone: 'America/Los_Angeles',
      offset: -7,
    },
    {
      id: '2',
      cityName: 'New York',
      timeZone: 'America/New_York',
      offset: -4,
    },
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
  },
});

export const { addTimeZone, removeTimeZone, setAddModalVisible } = clockSlice.actions;
export default clockSlice.reducer;