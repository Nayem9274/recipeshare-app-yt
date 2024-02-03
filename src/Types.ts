// types.ts
export type UpdateRecipeDataType = (key: string, value: any) => void;
export type UpdateBlogDataType = (key: string, value: any) => void;
export type updateState = (value: boolean) => void;
export type updatePercentage = (value: number) => void;
export type updateMsg= (value:string)=>void;
export type updateLink= (value:string)=>void;

export interface RecipeType {
    title: string;
    image: string;
    ingredients: { name: string; image: string }[];
    link: string;
  }