import { Album } from "./album";
import { Prettify } from "./prettify";

export type SortDirection = 'asc' | 'desc';

export type SortField = Prettify<keyof Album>;