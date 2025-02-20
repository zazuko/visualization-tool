import { DimensionValue } from '../domain/data';
import { Filters } from '../configurator';
import { Observation } from '../domain/data';
import { RawObservation } from '../domain/data';
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { ResolvedDataCube, ResolvedObservationsQuery, ResolvedMeasure, ResolvedDimension } from './shared-types';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DimensionValue: DimensionValue;
  FilterValue: any;
  Filters: Filters;
  GeoShapes: any;
  Observation: Observation;
  RawObservation: RawObservation;
};

export type DataCube = {
  __typename?: 'DataCube';
  iri: Scalars['String'];
  identifier?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  version?: Maybe<Scalars['String']>;
  contactName?: Maybe<Scalars['String']>;
  contactEmail?: Maybe<Scalars['String']>;
  creator?: Maybe<DataCubeOrganization>;
  landingPage?: Maybe<Scalars['String']>;
  workExamples?: Maybe<Array<Maybe<Scalars['String']>>>;
  publisher?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  datePublished?: Maybe<Scalars['String']>;
  expires?: Maybe<Scalars['String']>;
  publicationStatus: DataCubePublicationStatus;
  observations: ObservationsQuery;
  dimensions: Array<Dimension>;
  dimensionByIri?: Maybe<Dimension>;
  measures: Array<Measure>;
  themes: Array<DataCubeTheme>;
};


export type DataCubeObservationsArgs = {
  limit?: Maybe<Scalars['Int']>;
  dimensions?: Maybe<Array<Scalars['String']>>;
  filters?: Maybe<Scalars['Filters']>;
};


export type DataCubeDimensionByIriArgs = {
  iri: Scalars['String'];
};

export type DataCubeOrganization = {
  __typename?: 'DataCubeOrganization';
  iri: Scalars['String'];
  label?: Maybe<Scalars['String']>;
};

export enum DataCubePublicationStatus {
  Draft = 'DRAFT',
  Published = 'PUBLISHED'
}

export type DataCubeResult = {
  __typename?: 'DataCubeResult';
  score?: Maybe<Scalars['Float']>;
  highlightedTitle?: Maybe<Scalars['String']>;
  highlightedDescription?: Maybe<Scalars['String']>;
  dataCube: DataCube;
};

export enum DataCubeResultOrder {
  Score = 'SCORE',
  TitleAsc = 'TITLE_ASC',
  CreatedDesc = 'CREATED_DESC'
}

export type DataCubeSearchFilter = {
  type: Scalars['String'];
  value: Scalars['String'];
};

export type DataCubeTheme = {
  __typename?: 'DataCubeTheme';
  iri: Scalars['String'];
  label?: Maybe<Scalars['String']>;
};

export type DatasetCount = {
  __typename?: 'DatasetCount';
  iri: Scalars['String'];
  count: Scalars['Int'];
};

export type Dimension = {
  iri: Scalars['String'];
  label: Scalars['String'];
  unit?: Maybe<Scalars['String']>;
  scaleType?: Maybe<Scalars['String']>;
  isNumerical: Scalars['Boolean'];
  isKeyDimension: Scalars['Boolean'];
  values: Array<Scalars['DimensionValue']>;
  related?: Maybe<Array<RelatedDimension>>;
  hierarchy?: Maybe<Array<HierarchyValue>>;
};


export type DimensionValuesArgs = {
  filters?: Maybe<Scalars['Filters']>;
};




export type GeoCoordinates = {
  __typename?: 'GeoCoordinates';
  iri: Scalars['String'];
  label: Scalars['String'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
};

export type GeoCoordinatesDimension = Dimension & {
  __typename?: 'GeoCoordinatesDimension';
  iri: Scalars['String'];
  label: Scalars['String'];
  unit?: Maybe<Scalars['String']>;
  scaleType?: Maybe<Scalars['String']>;
  isNumerical: Scalars['Boolean'];
  isKeyDimension: Scalars['Boolean'];
  values: Array<Scalars['DimensionValue']>;
  geoCoordinates?: Maybe<Array<GeoCoordinates>>;
  related?: Maybe<Array<RelatedDimension>>;
  hierarchy?: Maybe<Array<HierarchyValue>>;
};


export type GeoCoordinatesDimensionValuesArgs = {
  filters?: Maybe<Scalars['Filters']>;
};


export type GeoShapesDimension = Dimension & {
  __typename?: 'GeoShapesDimension';
  iri: Scalars['String'];
  label: Scalars['String'];
  unit?: Maybe<Scalars['String']>;
  scaleType?: Maybe<Scalars['String']>;
  isNumerical: Scalars['Boolean'];
  isKeyDimension: Scalars['Boolean'];
  values: Array<Scalars['DimensionValue']>;
  geoShapes?: Maybe<Scalars['GeoShapes']>;
  related?: Maybe<Array<RelatedDimension>>;
  hierarchy?: Maybe<Array<HierarchyValue>>;
};


export type GeoShapesDimensionValuesArgs = {
  filters?: Maybe<Scalars['Filters']>;
};

export type HierarchyValue = {
  __typename?: 'HierarchyValue';
  value: Scalars['String'];
  label: Scalars['String'];
  dimensionIri: Scalars['String'];
  depth: Scalars['Int'];
  children?: Maybe<Array<HierarchyValue>>;
  hasValue?: Maybe<Scalars['Boolean']>;
};

export type Measure = Dimension & {
  __typename?: 'Measure';
  iri: Scalars['String'];
  label: Scalars['String'];
  unit?: Maybe<Scalars['String']>;
  scaleType?: Maybe<Scalars['String']>;
  isNumerical: Scalars['Boolean'];
  isKeyDimension: Scalars['Boolean'];
  values: Array<Scalars['DimensionValue']>;
  related?: Maybe<Array<RelatedDimension>>;
  hierarchy?: Maybe<Array<HierarchyValue>>;
};


export type MeasureValuesArgs = {
  filters?: Maybe<Scalars['Filters']>;
};

export type NominalDimension = Dimension & {
  __typename?: 'NominalDimension';
  iri: Scalars['String'];
  label: Scalars['String'];
  unit?: Maybe<Scalars['String']>;
  scaleType?: Maybe<Scalars['String']>;
  isNumerical: Scalars['Boolean'];
  isKeyDimension: Scalars['Boolean'];
  values: Array<Scalars['DimensionValue']>;
  related?: Maybe<Array<RelatedDimension>>;
  hierarchy?: Maybe<Array<HierarchyValue>>;
};


export type NominalDimensionValuesArgs = {
  filters?: Maybe<Scalars['Filters']>;
};


export type ObservationFilter = {
  __typename?: 'ObservationFilter';
  type: Scalars['String'];
  value?: Maybe<Scalars['FilterValue']>;
  iri: Scalars['String'];
};

export type ObservationsQuery = {
  __typename?: 'ObservationsQuery';
  /** Observations with their values parsed to native JS types */
  data: Array<Scalars['Observation']>;
  /** Observations with their original RDF-y type */
  rawData: Array<Scalars['RawObservation']>;
  /** The generated SPARQL query string of the current query (doesn't fetch any data) */
  sparql: Scalars['String'];
  /** The generated SPARQL query URL of the current query to run a query on the endpoint's editor directly */
  sparqlEditorUrl?: Maybe<Scalars['String']>;
};

export type OrdinalDimension = Dimension & {
  __typename?: 'OrdinalDimension';
  iri: Scalars['String'];
  label: Scalars['String'];
  unit?: Maybe<Scalars['String']>;
  scaleType?: Maybe<Scalars['String']>;
  isNumerical: Scalars['Boolean'];
  isKeyDimension: Scalars['Boolean'];
  values: Array<Scalars['DimensionValue']>;
  related?: Maybe<Array<RelatedDimension>>;
  hierarchy?: Maybe<Array<HierarchyValue>>;
};


export type OrdinalDimensionValuesArgs = {
  filters?: Maybe<Scalars['Filters']>;
};

export type Query = {
  __typename?: 'Query';
  dataCubeByIri?: Maybe<DataCube>;
  possibleFilters: Array<ObservationFilter>;
  dataCubes: Array<DataCubeResult>;
  themes: Array<DataCubeTheme>;
  subthemes: Array<DataCubeTheme>;
  organizations: Array<DataCubeOrganization>;
  datasetcount?: Maybe<Array<DatasetCount>>;
};


export type QueryDataCubeByIriArgs = {
  locale?: Maybe<Scalars['String']>;
  iri: Scalars['String'];
  latest?: Maybe<Scalars['Boolean']>;
  filters?: Maybe<Scalars['Filters']>;
};


export type QueryPossibleFiltersArgs = {
  iri: Scalars['String'];
  filters: Scalars['Filters'];
};


export type QueryDataCubesArgs = {
  locale?: Maybe<Scalars['String']>;
  query?: Maybe<Scalars['String']>;
  order?: Maybe<DataCubeResultOrder>;
  includeDrafts?: Maybe<Scalars['Boolean']>;
  filters?: Maybe<Array<DataCubeSearchFilter>>;
};


export type QueryThemesArgs = {
  locale: Scalars['String'];
};


export type QuerySubthemesArgs = {
  locale: Scalars['String'];
  parentIri: Scalars['String'];
};


export type QueryOrganizationsArgs = {
  locale: Scalars['String'];
};


export type QueryDatasetcountArgs = {
  theme?: Maybe<Scalars['String']>;
  organization?: Maybe<Scalars['String']>;
  subtheme?: Maybe<Scalars['String']>;
  includeDrafts?: Maybe<Scalars['Boolean']>;
};


export type RelatedDimension = {
  __typename?: 'RelatedDimension';
  type: Scalars['String'];
  iri: Scalars['String'];
};

export type TemporalDimension = Dimension & {
  __typename?: 'TemporalDimension';
  iri: Scalars['String'];
  label: Scalars['String'];
  timeUnit: TimeUnit;
  timeFormat: Scalars['String'];
  unit?: Maybe<Scalars['String']>;
  scaleType?: Maybe<Scalars['String']>;
  isNumerical: Scalars['Boolean'];
  isKeyDimension: Scalars['Boolean'];
  values: Array<Scalars['DimensionValue']>;
  related?: Maybe<Array<RelatedDimension>>;
  hierarchy?: Maybe<Array<HierarchyValue>>;
};


export type TemporalDimensionValuesArgs = {
  filters?: Maybe<Scalars['Filters']>;
};

export enum TimeUnit {
  Year = 'Year',
  Month = 'Month',
  Week = 'Week',
  Day = 'Day',
  Hour = 'Hour',
  Minute = 'Minute',
  Second = 'Second'
}

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  DataCube: ResolverTypeWrapper<ResolvedDataCube>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  DataCubeOrganization: ResolverTypeWrapper<DataCubeOrganization>;
  DataCubePublicationStatus: DataCubePublicationStatus;
  DataCubeResult: ResolverTypeWrapper<Omit<DataCubeResult, 'dataCube'> & { dataCube: ResolversTypes['DataCube'] }>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  DataCubeResultOrder: DataCubeResultOrder;
  DataCubeSearchFilter: DataCubeSearchFilter;
  DataCubeTheme: ResolverTypeWrapper<DataCubeTheme>;
  DatasetCount: ResolverTypeWrapper<DatasetCount>;
  Dimension: ResolverTypeWrapper<ResolvedDimension>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  DimensionValue: ResolverTypeWrapper<Scalars['DimensionValue']>;
  FilterValue: ResolverTypeWrapper<Scalars['FilterValue']>;
  Filters: ResolverTypeWrapper<Scalars['Filters']>;
  GeoCoordinates: ResolverTypeWrapper<GeoCoordinates>;
  GeoCoordinatesDimension: ResolverTypeWrapper<ResolvedDimension>;
  GeoShapes: ResolverTypeWrapper<Scalars['GeoShapes']>;
  GeoShapesDimension: ResolverTypeWrapper<ResolvedDimension>;
  HierarchyValue: ResolverTypeWrapper<HierarchyValue>;
  Measure: ResolverTypeWrapper<ResolvedMeasure>;
  NominalDimension: ResolverTypeWrapper<ResolvedDimension>;
  Observation: ResolverTypeWrapper<Scalars['Observation']>;
  ObservationFilter: ResolverTypeWrapper<ObservationFilter>;
  ObservationsQuery: ResolverTypeWrapper<ResolvedObservationsQuery>;
  OrdinalDimension: ResolverTypeWrapper<ResolvedDimension>;
  Query: ResolverTypeWrapper<{}>;
  RawObservation: ResolverTypeWrapper<Scalars['RawObservation']>;
  RelatedDimension: ResolverTypeWrapper<RelatedDimension>;
  TemporalDimension: ResolverTypeWrapper<ResolvedDimension>;
  TimeUnit: TimeUnit;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  DataCube: ResolvedDataCube;
  String: Scalars['String'];
  Int: Scalars['Int'];
  DataCubeOrganization: DataCubeOrganization;
  DataCubeResult: Omit<DataCubeResult, 'dataCube'> & { dataCube: ResolversParentTypes['DataCube'] };
  Float: Scalars['Float'];
  DataCubeSearchFilter: DataCubeSearchFilter;
  DataCubeTheme: DataCubeTheme;
  DatasetCount: DatasetCount;
  Dimension: ResolvedDimension;
  Boolean: Scalars['Boolean'];
  DimensionValue: Scalars['DimensionValue'];
  FilterValue: Scalars['FilterValue'];
  Filters: Scalars['Filters'];
  GeoCoordinates: GeoCoordinates;
  GeoCoordinatesDimension: ResolvedDimension;
  GeoShapes: Scalars['GeoShapes'];
  GeoShapesDimension: ResolvedDimension;
  HierarchyValue: HierarchyValue;
  Measure: ResolvedMeasure;
  NominalDimension: ResolvedDimension;
  Observation: Scalars['Observation'];
  ObservationFilter: ObservationFilter;
  ObservationsQuery: ResolvedObservationsQuery;
  OrdinalDimension: ResolvedDimension;
  Query: {};
  RawObservation: Scalars['RawObservation'];
  RelatedDimension: RelatedDimension;
  TemporalDimension: ResolvedDimension;
}>;

export type DataCubeResolvers<ContextType = any, ParentType extends ResolversParentTypes['DataCube'] = ResolversParentTypes['DataCube']> = ResolversObject<{
  iri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  identifier?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contactName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contactEmail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  creator?: Resolver<Maybe<ResolversTypes['DataCubeOrganization']>, ParentType, ContextType>;
  landingPage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  workExamples?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  publisher?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  datePublished?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  expires?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  publicationStatus?: Resolver<ResolversTypes['DataCubePublicationStatus'], ParentType, ContextType>;
  observations?: Resolver<ResolversTypes['ObservationsQuery'], ParentType, ContextType, RequireFields<DataCubeObservationsArgs, never>>;
  dimensions?: Resolver<Array<ResolversTypes['Dimension']>, ParentType, ContextType>;
  dimensionByIri?: Resolver<Maybe<ResolversTypes['Dimension']>, ParentType, ContextType, RequireFields<DataCubeDimensionByIriArgs, 'iri'>>;
  measures?: Resolver<Array<ResolversTypes['Measure']>, ParentType, ContextType>;
  themes?: Resolver<Array<ResolversTypes['DataCubeTheme']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DataCubeOrganizationResolvers<ContextType = any, ParentType extends ResolversParentTypes['DataCubeOrganization'] = ResolversParentTypes['DataCubeOrganization']> = ResolversObject<{
  iri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DataCubeResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DataCubeResult'] = ResolversParentTypes['DataCubeResult']> = ResolversObject<{
  score?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  highlightedTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  highlightedDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dataCube?: Resolver<ResolversTypes['DataCube'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DataCubeThemeResolvers<ContextType = any, ParentType extends ResolversParentTypes['DataCubeTheme'] = ResolversParentTypes['DataCubeTheme']> = ResolversObject<{
  iri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DatasetCountResolvers<ContextType = any, ParentType extends ResolversParentTypes['DatasetCount'] = ResolversParentTypes['DatasetCount']> = ResolversObject<{
  iri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DimensionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Dimension'] = ResolversParentTypes['Dimension']> = ResolversObject<{
  __resolveType: TypeResolveFn<'GeoCoordinatesDimension' | 'GeoShapesDimension' | 'Measure' | 'NominalDimension' | 'OrdinalDimension' | 'TemporalDimension', ParentType, ContextType>;
  iri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  scaleType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isNumerical?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isKeyDimension?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  values?: Resolver<Array<ResolversTypes['DimensionValue']>, ParentType, ContextType, RequireFields<DimensionValuesArgs, never>>;
  related?: Resolver<Maybe<Array<ResolversTypes['RelatedDimension']>>, ParentType, ContextType>;
  hierarchy?: Resolver<Maybe<Array<ResolversTypes['HierarchyValue']>>, ParentType, ContextType>;
}>;

export interface DimensionValueScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DimensionValue'], any> {
  name: 'DimensionValue';
}

export interface FilterValueScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['FilterValue'], any> {
  name: 'FilterValue';
}

export interface FiltersScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Filters'], any> {
  name: 'Filters';
}

export type GeoCoordinatesResolvers<ContextType = any, ParentType extends ResolversParentTypes['GeoCoordinates'] = ResolversParentTypes['GeoCoordinates']> = ResolversObject<{
  iri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  latitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  longitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GeoCoordinatesDimensionResolvers<ContextType = any, ParentType extends ResolversParentTypes['GeoCoordinatesDimension'] = ResolversParentTypes['GeoCoordinatesDimension']> = ResolversObject<{
  iri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  scaleType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isNumerical?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isKeyDimension?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  values?: Resolver<Array<ResolversTypes['DimensionValue']>, ParentType, ContextType, RequireFields<GeoCoordinatesDimensionValuesArgs, never>>;
  geoCoordinates?: Resolver<Maybe<Array<ResolversTypes['GeoCoordinates']>>, ParentType, ContextType>;
  related?: Resolver<Maybe<Array<ResolversTypes['RelatedDimension']>>, ParentType, ContextType>;
  hierarchy?: Resolver<Maybe<Array<ResolversTypes['HierarchyValue']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface GeoShapesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['GeoShapes'], any> {
  name: 'GeoShapes';
}

export type GeoShapesDimensionResolvers<ContextType = any, ParentType extends ResolversParentTypes['GeoShapesDimension'] = ResolversParentTypes['GeoShapesDimension']> = ResolversObject<{
  iri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  scaleType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isNumerical?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isKeyDimension?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  values?: Resolver<Array<ResolversTypes['DimensionValue']>, ParentType, ContextType, RequireFields<GeoShapesDimensionValuesArgs, never>>;
  geoShapes?: Resolver<Maybe<ResolversTypes['GeoShapes']>, ParentType, ContextType>;
  related?: Resolver<Maybe<Array<ResolversTypes['RelatedDimension']>>, ParentType, ContextType>;
  hierarchy?: Resolver<Maybe<Array<ResolversTypes['HierarchyValue']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HierarchyValueResolvers<ContextType = any, ParentType extends ResolversParentTypes['HierarchyValue'] = ResolversParentTypes['HierarchyValue']> = ResolversObject<{
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dimensionIri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  depth?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  children?: Resolver<Maybe<Array<ResolversTypes['HierarchyValue']>>, ParentType, ContextType>;
  hasValue?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MeasureResolvers<ContextType = any, ParentType extends ResolversParentTypes['Measure'] = ResolversParentTypes['Measure']> = ResolversObject<{
  iri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  scaleType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isNumerical?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isKeyDimension?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  values?: Resolver<Array<ResolversTypes['DimensionValue']>, ParentType, ContextType, RequireFields<MeasureValuesArgs, never>>;
  related?: Resolver<Maybe<Array<ResolversTypes['RelatedDimension']>>, ParentType, ContextType>;
  hierarchy?: Resolver<Maybe<Array<ResolversTypes['HierarchyValue']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NominalDimensionResolvers<ContextType = any, ParentType extends ResolversParentTypes['NominalDimension'] = ResolversParentTypes['NominalDimension']> = ResolversObject<{
  iri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  scaleType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isNumerical?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isKeyDimension?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  values?: Resolver<Array<ResolversTypes['DimensionValue']>, ParentType, ContextType, RequireFields<NominalDimensionValuesArgs, never>>;
  related?: Resolver<Maybe<Array<ResolversTypes['RelatedDimension']>>, ParentType, ContextType>;
  hierarchy?: Resolver<Maybe<Array<ResolversTypes['HierarchyValue']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface ObservationScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Observation'], any> {
  name: 'Observation';
}

export type ObservationFilterResolvers<ContextType = any, ParentType extends ResolversParentTypes['ObservationFilter'] = ResolversParentTypes['ObservationFilter']> = ResolversObject<{
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['FilterValue']>, ParentType, ContextType>;
  iri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ObservationsQueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['ObservationsQuery'] = ResolversParentTypes['ObservationsQuery']> = ResolversObject<{
  data?: Resolver<Array<ResolversTypes['Observation']>, ParentType, ContextType>;
  rawData?: Resolver<Array<ResolversTypes['RawObservation']>, ParentType, ContextType>;
  sparql?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sparqlEditorUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OrdinalDimensionResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrdinalDimension'] = ResolversParentTypes['OrdinalDimension']> = ResolversObject<{
  iri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  scaleType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isNumerical?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isKeyDimension?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  values?: Resolver<Array<ResolversTypes['DimensionValue']>, ParentType, ContextType, RequireFields<OrdinalDimensionValuesArgs, never>>;
  related?: Resolver<Maybe<Array<ResolversTypes['RelatedDimension']>>, ParentType, ContextType>;
  hierarchy?: Resolver<Maybe<Array<ResolversTypes['HierarchyValue']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  dataCubeByIri?: Resolver<Maybe<ResolversTypes['DataCube']>, ParentType, ContextType, RequireFields<QueryDataCubeByIriArgs, 'iri' | 'latest'>>;
  possibleFilters?: Resolver<Array<ResolversTypes['ObservationFilter']>, ParentType, ContextType, RequireFields<QueryPossibleFiltersArgs, 'iri' | 'filters'>>;
  dataCubes?: Resolver<Array<ResolversTypes['DataCubeResult']>, ParentType, ContextType, RequireFields<QueryDataCubesArgs, never>>;
  themes?: Resolver<Array<ResolversTypes['DataCubeTheme']>, ParentType, ContextType, RequireFields<QueryThemesArgs, 'locale'>>;
  subthemes?: Resolver<Array<ResolversTypes['DataCubeTheme']>, ParentType, ContextType, RequireFields<QuerySubthemesArgs, 'locale' | 'parentIri'>>;
  organizations?: Resolver<Array<ResolversTypes['DataCubeOrganization']>, ParentType, ContextType, RequireFields<QueryOrganizationsArgs, 'locale'>>;
  datasetcount?: Resolver<Maybe<Array<ResolversTypes['DatasetCount']>>, ParentType, ContextType, RequireFields<QueryDatasetcountArgs, never>>;
}>;

export interface RawObservationScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['RawObservation'], any> {
  name: 'RawObservation';
}

export type RelatedDimensionResolvers<ContextType = any, ParentType extends ResolversParentTypes['RelatedDimension'] = ResolversParentTypes['RelatedDimension']> = ResolversObject<{
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  iri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TemporalDimensionResolvers<ContextType = any, ParentType extends ResolversParentTypes['TemporalDimension'] = ResolversParentTypes['TemporalDimension']> = ResolversObject<{
  iri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timeUnit?: Resolver<ResolversTypes['TimeUnit'], ParentType, ContextType>;
  timeFormat?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  scaleType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isNumerical?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isKeyDimension?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  values?: Resolver<Array<ResolversTypes['DimensionValue']>, ParentType, ContextType, RequireFields<TemporalDimensionValuesArgs, never>>;
  related?: Resolver<Maybe<Array<ResolversTypes['RelatedDimension']>>, ParentType, ContextType>;
  hierarchy?: Resolver<Maybe<Array<ResolversTypes['HierarchyValue']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  DataCube?: DataCubeResolvers<ContextType>;
  DataCubeOrganization?: DataCubeOrganizationResolvers<ContextType>;
  DataCubeResult?: DataCubeResultResolvers<ContextType>;
  DataCubeTheme?: DataCubeThemeResolvers<ContextType>;
  DatasetCount?: DatasetCountResolvers<ContextType>;
  Dimension?: DimensionResolvers<ContextType>;
  DimensionValue?: GraphQLScalarType;
  FilterValue?: GraphQLScalarType;
  Filters?: GraphQLScalarType;
  GeoCoordinates?: GeoCoordinatesResolvers<ContextType>;
  GeoCoordinatesDimension?: GeoCoordinatesDimensionResolvers<ContextType>;
  GeoShapes?: GraphQLScalarType;
  GeoShapesDimension?: GeoShapesDimensionResolvers<ContextType>;
  HierarchyValue?: HierarchyValueResolvers<ContextType>;
  Measure?: MeasureResolvers<ContextType>;
  NominalDimension?: NominalDimensionResolvers<ContextType>;
  Observation?: GraphQLScalarType;
  ObservationFilter?: ObservationFilterResolvers<ContextType>;
  ObservationsQuery?: ObservationsQueryResolvers<ContextType>;
  OrdinalDimension?: OrdinalDimensionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RawObservation?: GraphQLScalarType;
  RelatedDimension?: RelatedDimensionResolvers<ContextType>;
  TemporalDimension?: TemporalDimensionResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
