import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type IdOnly = {
  __typename?: 'IdOnly';
  _id: Scalars['ID'];
};

export type Default = {
  __typename?: 'Default';
  _id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};


export type User = {
  __typename?: 'User';
  _id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  name: Scalars['String'];
  email: Scalars['String'];
  avatar?: Maybe<Scalars['String']>;
};

export type Like = {
  __typename?: 'Like';
  _id: Scalars['ID'];
  user: User;
  value: Scalars['Int'];
};

export type Comment = {
  __typename?: 'Comment';
  _id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  text: Scalars['String'];
  user: User;
};

export type Post = {
  __typename?: 'Post';
  _id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  title: Scalars['String'];
  body?: Maybe<Scalars['String']>;
  comments: Array<Comment>;
  likesCount: Scalars['Int'];
  userLike?: Maybe<Scalars['Int']>;
  user: User;
  likeCount: Scalars['Int'];
  dislikeCount: Scalars['Int'];
};

export type FieldError = {
  __typename?: 'FieldError';
  path: Scalars['String'];
  message: Scalars['String'];
};

export type FieldErrorArray = {
  __typename?: 'FieldErrorArray';
  errors?: Maybe<Array<FieldError>>;
};

export type PostResponse = {
  __typename?: 'PostResponse';
  errors?: Maybe<Array<FieldError>>;
  post?: Maybe<Post>;
};

export type Experience = {
  __typename?: 'Experience';
  _id: Scalars['ID'];
  title: Scalars['String'];
  company: Scalars['String'];
  location?: Maybe<Scalars['String']>;
  from: Scalars['DateTime'];
  to?: Maybe<Scalars['DateTime']>;
  current: Scalars['Boolean'];
  description?: Maybe<Scalars['String']>;
};

export type Education = {
  __typename?: 'Education';
  _id: Scalars['ID'];
  school: Scalars['String'];
  degree: Scalars['String'];
  fieldofstudy: Scalars['String'];
  from: Scalars['DateTime'];
  to?: Maybe<Scalars['DateTime']>;
  current: Scalars['Boolean'];
  description?: Maybe<Scalars['String']>;
};

export type Social = {
  __typename?: 'Social';
  youtube?: Maybe<Scalars['String']>;
  twitter?: Maybe<Scalars['String']>;
  facebook?: Maybe<Scalars['String']>;
  linkedin?: Maybe<Scalars['String']>;
  instagram?: Maybe<Scalars['String']>;
};

export type Profile = {
  __typename?: 'Profile';
  _id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  user: User;
  company?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  status: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
  githubusername?: Maybe<Scalars['String']>;
  skills: Scalars['String'];
  experiences: Array<Experience>;
  educations: Array<Education>;
  social: Social;
};

export type ProfileResponse = {
  __typename?: 'ProfileResponse';
  errors?: Maybe<Array<FieldError>>;
  profile?: Maybe<Profile>;
};

export type ExpResponse = {
  __typename?: 'ExpResponse';
  errors?: Maybe<Array<FieldError>>;
  experience?: Maybe<Experience>;
};

export type EduResponse = {
  __typename?: 'EduResponse';
  errors?: Maybe<Array<FieldError>>;
  education?: Maybe<Education>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  user?: Maybe<User>;
  errors?: Maybe<Array<FieldError>>;
};

export type SocialInput = {
  youtube?: Maybe<Scalars['String']>;
  twitter?: Maybe<Scalars['String']>;
  facebook?: Maybe<Scalars['String']>;
  linkedin?: Maybe<Scalars['String']>;
  instagram?: Maybe<Scalars['String']>;
};

export type ProfileInputType = {
  company?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  status: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
  githubusername?: Maybe<Scalars['String']>;
  skills: Scalars['String'];
  social?: Maybe<SocialInput>;
};

export type ExpInput = {
  title: Scalars['String'];
  company: Scalars['String'];
  location?: Maybe<Scalars['String']>;
  from: Scalars['DateTime'];
  to?: Maybe<Scalars['DateTime']>;
  current?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
};

export type EduInput = {
  school?: Maybe<Scalars['String']>;
  degree?: Maybe<Scalars['String']>;
  fieldofstudy?: Maybe<Scalars['String']>;
  from: Scalars['DateTime'];
  to?: Maybe<Scalars['DateTime']>;
  current: Scalars['Boolean'];
  description?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  getPosts: Array<Post>;
  getOnePost?: Maybe<Post>;
  myProfile?: Maybe<Profile>;
  getAllProfiles: Array<Profile>;
  getProfileByUserId?: Maybe<Profile>;
  me?: Maybe<User>;
};


export type QueryGetOnePostArgs = {
  postId: Scalars['ID'];
};


export type QueryGetProfileByUserIdArgs = {
  userId: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addPost: PostResponse;
  deletePost: Scalars['Boolean'];
  toggleLike: Scalars['Boolean'];
  addComment?: Maybe<Comment>;
  deleteComment: Scalars['Boolean'];
  createProfile: ProfileResponse;
  updateProfile: ProfileResponse;
  deleteUser: Scalars['Boolean'];
  addExperience: ExpResponse;
  deleteExp: Scalars['Boolean'];
  addEducation: EduResponse;
  deleteEdu: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
};


export type MutationAddPostArgs = {
  title: Scalars['String'];
  body?: Maybe<Scalars['String']>;
};


export type MutationDeletePostArgs = {
  postId: Scalars['ID'];
};


export type MutationToggleLikeArgs = {
  value: Scalars['Int'];
  postId: Scalars['ID'];
};


export type MutationAddCommentArgs = {
  postId: Scalars['ID'];
  text: Scalars['String'];
};


export type MutationDeleteCommentArgs = {
  commentId: Scalars['ID'];
  postId: Scalars['ID'];
};


export type MutationCreateProfileArgs = {
  profileInput: ProfileInputType;
};


export type MutationUpdateProfileArgs = {
  profileInput: ProfileInputType;
};


export type MutationAddExperienceArgs = {
  expInput: ExpInput;
};


export type MutationDeleteExpArgs = {
  expId: Scalars['ID'];
};


export type MutationAddEducationArgs = {
  eduInput: EduInput;
};


export type MutationDeleteEduArgs = {
  eduId: Scalars['ID'];
};


export type MutationRegisterArgs = {
  name: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};

export type CommentFieldsFragment = (
  { __typename?: 'Comment' }
  & Pick<Comment, '_id' | 'createdAt' | 'updatedAt' | 'text'>
  & { user: (
    { __typename?: 'User' }
    & UserFieldsFragment
  ) }
);

export type EduFieldsFragment = (
  { __typename?: 'Education' }
  & Pick<Education, '_id' | 'school' | 'degree' | 'fieldofstudy' | 'from' | 'to' | 'current' | 'description'>
);

export type ExpFieldsFragment = (
  { __typename?: 'Experience' }
  & Pick<Experience, '_id' | 'title' | 'company' | 'location' | 'from' | 'to' | 'current' | 'description'>
);

export type PostFieldsFragment = (
  { __typename?: 'Post' }
  & Pick<Post, '_id' | 'createdAt' | 'updatedAt' | 'title' | 'body' | 'likeCount' | 'dislikeCount' | 'userLike'>
  & { user: (
    { __typename?: 'User' }
    & UserFieldsFragment
  ), comments: Array<(
    { __typename?: 'Comment' }
    & CommentFieldsFragment
  )> }
);

export type ProfileFieldsFragment = (
  { __typename?: 'Profile' }
  & Pick<Profile, '_id' | 'createdAt' | 'updatedAt' | 'company' | 'website' | 'location' | 'status' | 'bio' | 'githubusername' | 'skills'>
);

export type RegularProfileFragment = (
  { __typename?: 'Profile' }
  & { experiences: Array<(
    { __typename?: 'Experience' }
    & ExpFieldsFragment
  )>, educations: Array<(
    { __typename?: 'Education' }
    & EduFieldsFragment
  )>, user: (
    { __typename?: 'User' }
    & UserFieldsFragment
  ), social: (
    { __typename?: 'Social' }
    & SocialFieldsFragment
  ) }
  & ProfileFieldsFragment
);

export type SocialFieldsFragment = (
  { __typename?: 'Social' }
  & Pick<Social, 'youtube' | 'twitter' | 'facebook' | 'linkedin' | 'instagram'>
);

export type UserFieldsFragment = (
  { __typename?: 'User' }
  & Pick<User, '_id' | 'name' | 'email' | 'avatar'>
);

export type UserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & UserFieldsFragment
  )>, errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & Pick<FieldError, 'path' | 'message'>
  )>> }
);

export type AddCommentMutationVariables = Exact<{
  postId: Scalars['ID'];
  text: Scalars['String'];
}>;


export type AddCommentMutation = (
  { __typename?: 'Mutation' }
  & { addComment?: Maybe<(
    { __typename?: 'Comment' }
    & CommentFieldsFragment
  )> }
);

export type AddEduMutationVariables = Exact<{
  eduInput: EduInput;
}>;


export type AddEduMutation = (
  { __typename?: 'Mutation' }
  & { addEducation: (
    { __typename?: 'EduResponse' }
    & { education?: Maybe<(
      { __typename?: 'Education' }
      & EduFieldsFragment
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'path' | 'message'>
    )>> }
  ) }
);

export type AddExpMutationVariables = Exact<{
  expInput: ExpInput;
}>;


export type AddExpMutation = (
  { __typename?: 'Mutation' }
  & { addExperience: (
    { __typename?: 'ExpResponse' }
    & { experience?: Maybe<(
      { __typename?: 'Experience' }
      & ExpFieldsFragment
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'path' | 'message'>
    )>> }
  ) }
);

export type AddPostMutationVariables = Exact<{
  title: Scalars['String'];
  body?: Maybe<Scalars['String']>;
}>;


export type AddPostMutation = (
  { __typename?: 'Mutation' }
  & { addPost: (
    { __typename?: 'PostResponse' }
    & { post?: Maybe<(
      { __typename?: 'Post' }
      & PostFieldsFragment
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'path' | 'message'>
    )>> }
  ) }
);

export type CreateProfileMutationVariables = Exact<{
  profileInput: ProfileInputType;
}>;


export type CreateProfileMutation = (
  { __typename?: 'Mutation' }
  & { createProfile: (
    { __typename?: 'ProfileResponse' }
    & { profile?: Maybe<(
      { __typename?: 'Profile' }
      & RegularProfileFragment
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'path' | 'message'>
    )>> }
  ) }
);

export type DeleteCommentMutationVariables = Exact<{
  postId: Scalars['ID'];
  commentId: Scalars['ID'];
}>;


export type DeleteCommentMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteComment'>
);

export type DeleteEduMutationVariables = Exact<{
  eduId: Scalars['ID'];
}>;


export type DeleteEduMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteEdu'>
);

export type DeleteExpMutationVariables = Exact<{
  expId: Scalars['ID'];
}>;


export type DeleteExpMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteExp'>
);

export type DeletePostMutationVariables = Exact<{
  postId: Scalars['ID'];
}>;


export type DeletePostMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deletePost'>
);

export type DeleteUserMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteUser'>
);

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & UserResponseFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  name: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & UserResponseFragment
  ) }
);

export type ToggleLikeMutationVariables = Exact<{
  postId: Scalars['ID'];
  value: Scalars['Int'];
}>;


export type ToggleLikeMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'toggleLike'>
);

export type UpdateProfileMutationVariables = Exact<{
  profileInput: ProfileInputType;
}>;


export type UpdateProfileMutation = (
  { __typename?: 'Mutation' }
  & { updateProfile: (
    { __typename?: 'ProfileResponse' }
    & { profile?: Maybe<(
      { __typename?: 'Profile' }
      & RegularProfileFragment
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'path' | 'message'>
    )>> }
  ) }
);

export type GetAllProfilesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllProfilesQuery = (
  { __typename?: 'Query' }
  & { getAllProfiles: Array<(
    { __typename?: 'Profile' }
    & RegularProfileFragment
  )> }
);

export type GetOnePostQueryVariables = Exact<{
  postId: Scalars['ID'];
}>;


export type GetOnePostQuery = (
  { __typename?: 'Query' }
  & { getOnePost?: Maybe<(
    { __typename?: 'Post' }
    & PostFieldsFragment
  )> }
);

export type GetPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPostsQuery = (
  { __typename?: 'Query' }
  & { getPosts: Array<(
    { __typename?: 'Post' }
    & PostFieldsFragment
  )> }
);

export type GetProfileQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type GetProfileQuery = (
  { __typename?: 'Query' }
  & { getProfileByUserId?: Maybe<(
    { __typename?: 'Profile' }
    & RegularProfileFragment
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & UserFieldsFragment
  )> }
);

export type MyProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type MyProfileQuery = (
  { __typename?: 'Query' }
  & { myProfile?: Maybe<(
    { __typename?: 'Profile' }
    & RegularProfileFragment
  )> }
);

export const UserFieldsFragmentDoc = gql`
    fragment UserFields on User {
  _id
  name
  email
  avatar
}
    `;
export const CommentFieldsFragmentDoc = gql`
    fragment CommentFields on Comment {
  _id
  createdAt
  updatedAt
  text
  user {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;
export const PostFieldsFragmentDoc = gql`
    fragment PostFields on Post {
  _id
  createdAt
  updatedAt
  title
  body
  likeCount
  dislikeCount
  userLike
  user {
    ...UserFields
  }
  comments {
    ...CommentFields
  }
}
    ${UserFieldsFragmentDoc}
${CommentFieldsFragmentDoc}`;
export const ProfileFieldsFragmentDoc = gql`
    fragment ProfileFields on Profile {
  _id
  createdAt
  updatedAt
  company
  website
  location
  status
  bio
  githubusername
  skills
}
    `;
export const ExpFieldsFragmentDoc = gql`
    fragment ExpFields on Experience {
  _id
  title
  company
  location
  from
  to
  current
  description
}
    `;
export const EduFieldsFragmentDoc = gql`
    fragment EduFields on Education {
  _id
  school
  degree
  fieldofstudy
  from
  to
  current
  description
}
    `;
export const SocialFieldsFragmentDoc = gql`
    fragment SocialFields on Social {
  youtube
  twitter
  facebook
  linkedin
  instagram
}
    `;
export const RegularProfileFragmentDoc = gql`
    fragment RegularProfile on Profile {
  ...ProfileFields
  experiences {
    ...ExpFields
  }
  educations {
    ...EduFields
  }
  user {
    ...UserFields
  }
  social {
    ...SocialFields
  }
}
    ${ProfileFieldsFragmentDoc}
${ExpFieldsFragmentDoc}
${EduFieldsFragmentDoc}
${UserFieldsFragmentDoc}
${SocialFieldsFragmentDoc}`;
export const UserResponseFragmentDoc = gql`
    fragment UserResponse on UserResponse {
  user {
    ...UserFields
  }
  errors {
    path
    message
  }
}
    ${UserFieldsFragmentDoc}`;
export const AddCommentDocument = gql`
    mutation AddComment($postId: ID!, $text: String!) {
  addComment(postId: $postId, text: $text) {
    ...CommentFields
  }
}
    ${CommentFieldsFragmentDoc}`;
export type AddCommentMutationFn = Apollo.MutationFunction<AddCommentMutation, AddCommentMutationVariables>;

/**
 * __useAddCommentMutation__
 *
 * To run a mutation, you first call `useAddCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCommentMutation, { data, loading, error }] = useAddCommentMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *      text: // value for 'text'
 *   },
 * });
 */
export function useAddCommentMutation(baseOptions?: Apollo.MutationHookOptions<AddCommentMutation, AddCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCommentMutation, AddCommentMutationVariables>(AddCommentDocument, options);
      }
export type AddCommentMutationHookResult = ReturnType<typeof useAddCommentMutation>;
export type AddCommentMutationResult = Apollo.MutationResult<AddCommentMutation>;
export type AddCommentMutationOptions = Apollo.BaseMutationOptions<AddCommentMutation, AddCommentMutationVariables>;
export const AddEduDocument = gql`
    mutation AddEdu($eduInput: EduInput!) {
  addEducation(eduInput: $eduInput) {
    education {
      ...EduFields
    }
    errors {
      path
      message
    }
  }
}
    ${EduFieldsFragmentDoc}`;
export type AddEduMutationFn = Apollo.MutationFunction<AddEduMutation, AddEduMutationVariables>;

/**
 * __useAddEduMutation__
 *
 * To run a mutation, you first call `useAddEduMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddEduMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addEduMutation, { data, loading, error }] = useAddEduMutation({
 *   variables: {
 *      eduInput: // value for 'eduInput'
 *   },
 * });
 */
export function useAddEduMutation(baseOptions?: Apollo.MutationHookOptions<AddEduMutation, AddEduMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddEduMutation, AddEduMutationVariables>(AddEduDocument, options);
      }
export type AddEduMutationHookResult = ReturnType<typeof useAddEduMutation>;
export type AddEduMutationResult = Apollo.MutationResult<AddEduMutation>;
export type AddEduMutationOptions = Apollo.BaseMutationOptions<AddEduMutation, AddEduMutationVariables>;
export const AddExpDocument = gql`
    mutation AddExp($expInput: ExpInput!) {
  addExperience(expInput: $expInput) {
    experience {
      ...ExpFields
    }
    errors {
      path
      message
    }
  }
}
    ${ExpFieldsFragmentDoc}`;
export type AddExpMutationFn = Apollo.MutationFunction<AddExpMutation, AddExpMutationVariables>;

/**
 * __useAddExpMutation__
 *
 * To run a mutation, you first call `useAddExpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddExpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addExpMutation, { data, loading, error }] = useAddExpMutation({
 *   variables: {
 *      expInput: // value for 'expInput'
 *   },
 * });
 */
export function useAddExpMutation(baseOptions?: Apollo.MutationHookOptions<AddExpMutation, AddExpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddExpMutation, AddExpMutationVariables>(AddExpDocument, options);
      }
export type AddExpMutationHookResult = ReturnType<typeof useAddExpMutation>;
export type AddExpMutationResult = Apollo.MutationResult<AddExpMutation>;
export type AddExpMutationOptions = Apollo.BaseMutationOptions<AddExpMutation, AddExpMutationVariables>;
export const AddPostDocument = gql`
    mutation AddPost($title: String!, $body: String) {
  addPost(title: $title, body: $body) {
    post {
      ...PostFields
    }
    errors {
      path
      message
    }
  }
}
    ${PostFieldsFragmentDoc}`;
export type AddPostMutationFn = Apollo.MutationFunction<AddPostMutation, AddPostMutationVariables>;

/**
 * __useAddPostMutation__
 *
 * To run a mutation, you first call `useAddPostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPostMutation, { data, loading, error }] = useAddPostMutation({
 *   variables: {
 *      title: // value for 'title'
 *      body: // value for 'body'
 *   },
 * });
 */
export function useAddPostMutation(baseOptions?: Apollo.MutationHookOptions<AddPostMutation, AddPostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddPostMutation, AddPostMutationVariables>(AddPostDocument, options);
      }
export type AddPostMutationHookResult = ReturnType<typeof useAddPostMutation>;
export type AddPostMutationResult = Apollo.MutationResult<AddPostMutation>;
export type AddPostMutationOptions = Apollo.BaseMutationOptions<AddPostMutation, AddPostMutationVariables>;
export const CreateProfileDocument = gql`
    mutation CreateProfile($profileInput: ProfileInputType!) {
  createProfile(profileInput: $profileInput) {
    profile {
      ...RegularProfile
    }
    errors {
      path
      message
    }
  }
}
    ${RegularProfileFragmentDoc}`;
export type CreateProfileMutationFn = Apollo.MutationFunction<CreateProfileMutation, CreateProfileMutationVariables>;

/**
 * __useCreateProfileMutation__
 *
 * To run a mutation, you first call `useCreateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProfileMutation, { data, loading, error }] = useCreateProfileMutation({
 *   variables: {
 *      profileInput: // value for 'profileInput'
 *   },
 * });
 */
export function useCreateProfileMutation(baseOptions?: Apollo.MutationHookOptions<CreateProfileMutation, CreateProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProfileMutation, CreateProfileMutationVariables>(CreateProfileDocument, options);
      }
export type CreateProfileMutationHookResult = ReturnType<typeof useCreateProfileMutation>;
export type CreateProfileMutationResult = Apollo.MutationResult<CreateProfileMutation>;
export type CreateProfileMutationOptions = Apollo.BaseMutationOptions<CreateProfileMutation, CreateProfileMutationVariables>;
export const DeleteCommentDocument = gql`
    mutation DeleteComment($postId: ID!, $commentId: ID!) {
  deleteComment(postId: $postId, commentId: $commentId)
}
    `;
export type DeleteCommentMutationFn = Apollo.MutationFunction<DeleteCommentMutation, DeleteCommentMutationVariables>;

/**
 * __useDeleteCommentMutation__
 *
 * To run a mutation, you first call `useDeleteCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCommentMutation, { data, loading, error }] = useDeleteCommentMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *      commentId: // value for 'commentId'
 *   },
 * });
 */
export function useDeleteCommentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCommentMutation, DeleteCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCommentMutation, DeleteCommentMutationVariables>(DeleteCommentDocument, options);
      }
export type DeleteCommentMutationHookResult = ReturnType<typeof useDeleteCommentMutation>;
export type DeleteCommentMutationResult = Apollo.MutationResult<DeleteCommentMutation>;
export type DeleteCommentMutationOptions = Apollo.BaseMutationOptions<DeleteCommentMutation, DeleteCommentMutationVariables>;
export const DeleteEduDocument = gql`
    mutation DeleteEdu($eduId: ID!) {
  deleteEdu(eduId: $eduId)
}
    `;
export type DeleteEduMutationFn = Apollo.MutationFunction<DeleteEduMutation, DeleteEduMutationVariables>;

/**
 * __useDeleteEduMutation__
 *
 * To run a mutation, you first call `useDeleteEduMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEduMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEduMutation, { data, loading, error }] = useDeleteEduMutation({
 *   variables: {
 *      eduId: // value for 'eduId'
 *   },
 * });
 */
export function useDeleteEduMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEduMutation, DeleteEduMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEduMutation, DeleteEduMutationVariables>(DeleteEduDocument, options);
      }
export type DeleteEduMutationHookResult = ReturnType<typeof useDeleteEduMutation>;
export type DeleteEduMutationResult = Apollo.MutationResult<DeleteEduMutation>;
export type DeleteEduMutationOptions = Apollo.BaseMutationOptions<DeleteEduMutation, DeleteEduMutationVariables>;
export const DeleteExpDocument = gql`
    mutation DeleteExp($expId: ID!) {
  deleteExp(expId: $expId)
}
    `;
export type DeleteExpMutationFn = Apollo.MutationFunction<DeleteExpMutation, DeleteExpMutationVariables>;

/**
 * __useDeleteExpMutation__
 *
 * To run a mutation, you first call `useDeleteExpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteExpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteExpMutation, { data, loading, error }] = useDeleteExpMutation({
 *   variables: {
 *      expId: // value for 'expId'
 *   },
 * });
 */
export function useDeleteExpMutation(baseOptions?: Apollo.MutationHookOptions<DeleteExpMutation, DeleteExpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteExpMutation, DeleteExpMutationVariables>(DeleteExpDocument, options);
      }
export type DeleteExpMutationHookResult = ReturnType<typeof useDeleteExpMutation>;
export type DeleteExpMutationResult = Apollo.MutationResult<DeleteExpMutation>;
export type DeleteExpMutationOptions = Apollo.BaseMutationOptions<DeleteExpMutation, DeleteExpMutationVariables>;
export const DeletePostDocument = gql`
    mutation DeletePost($postId: ID!) {
  deletePost(postId: $postId)
}
    `;
export type DeletePostMutationFn = Apollo.MutationFunction<DeletePostMutation, DeletePostMutationVariables>;

/**
 * __useDeletePostMutation__
 *
 * To run a mutation, you first call `useDeletePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePostMutation, { data, loading, error }] = useDeletePostMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useDeletePostMutation(baseOptions?: Apollo.MutationHookOptions<DeletePostMutation, DeletePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument, options);
      }
export type DeletePostMutationHookResult = ReturnType<typeof useDeletePostMutation>;
export type DeletePostMutationResult = Apollo.MutationResult<DeletePostMutation>;
export type DeletePostMutationOptions = Apollo.BaseMutationOptions<DeletePostMutation, DeletePostMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser {
  deleteUser
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    ...UserResponse
  }
}
    ${UserResponseFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($name: String!, $email: String!, $password: String!) {
  register(name: $name, email: $email, password: $password) {
    ...UserResponse
  }
}
    ${UserResponseFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      name: // value for 'name'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const ToggleLikeDocument = gql`
    mutation ToggleLike($postId: ID!, $value: Int!) {
  toggleLike(postId: $postId, value: $value)
}
    `;
export type ToggleLikeMutationFn = Apollo.MutationFunction<ToggleLikeMutation, ToggleLikeMutationVariables>;

/**
 * __useToggleLikeMutation__
 *
 * To run a mutation, you first call `useToggleLikeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleLikeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleLikeMutation, { data, loading, error }] = useToggleLikeMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useToggleLikeMutation(baseOptions?: Apollo.MutationHookOptions<ToggleLikeMutation, ToggleLikeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleLikeMutation, ToggleLikeMutationVariables>(ToggleLikeDocument, options);
      }
export type ToggleLikeMutationHookResult = ReturnType<typeof useToggleLikeMutation>;
export type ToggleLikeMutationResult = Apollo.MutationResult<ToggleLikeMutation>;
export type ToggleLikeMutationOptions = Apollo.BaseMutationOptions<ToggleLikeMutation, ToggleLikeMutationVariables>;
export const UpdateProfileDocument = gql`
    mutation UpdateProfile($profileInput: ProfileInputType!) {
  updateProfile(profileInput: $profileInput) {
    profile {
      ...RegularProfile
    }
    errors {
      path
      message
    }
  }
}
    ${RegularProfileFragmentDoc}`;
export type UpdateProfileMutationFn = Apollo.MutationFunction<UpdateProfileMutation, UpdateProfileMutationVariables>;

/**
 * __useUpdateProfileMutation__
 *
 * To run a mutation, you first call `useUpdateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileMutation, { data, loading, error }] = useUpdateProfileMutation({
 *   variables: {
 *      profileInput: // value for 'profileInput'
 *   },
 * });
 */
export function useUpdateProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProfileMutation, UpdateProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(UpdateProfileDocument, options);
      }
export type UpdateProfileMutationHookResult = ReturnType<typeof useUpdateProfileMutation>;
export type UpdateProfileMutationResult = Apollo.MutationResult<UpdateProfileMutation>;
export type UpdateProfileMutationOptions = Apollo.BaseMutationOptions<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const GetAllProfilesDocument = gql`
    query GetAllProfiles {
  getAllProfiles {
    ...RegularProfile
  }
}
    ${RegularProfileFragmentDoc}`;

/**
 * __useGetAllProfilesQuery__
 *
 * To run a query within a React component, call `useGetAllProfilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllProfilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllProfilesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllProfilesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllProfilesQuery, GetAllProfilesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllProfilesQuery, GetAllProfilesQueryVariables>(GetAllProfilesDocument, options);
      }
export function useGetAllProfilesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllProfilesQuery, GetAllProfilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllProfilesQuery, GetAllProfilesQueryVariables>(GetAllProfilesDocument, options);
        }
export type GetAllProfilesQueryHookResult = ReturnType<typeof useGetAllProfilesQuery>;
export type GetAllProfilesLazyQueryHookResult = ReturnType<typeof useGetAllProfilesLazyQuery>;
export type GetAllProfilesQueryResult = Apollo.QueryResult<GetAllProfilesQuery, GetAllProfilesQueryVariables>;
export const GetOnePostDocument = gql`
    query GetOnePost($postId: ID!) {
  getOnePost(postId: $postId) {
    ...PostFields
  }
}
    ${PostFieldsFragmentDoc}`;

/**
 * __useGetOnePostQuery__
 *
 * To run a query within a React component, call `useGetOnePostQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOnePostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOnePostQuery({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useGetOnePostQuery(baseOptions: Apollo.QueryHookOptions<GetOnePostQuery, GetOnePostQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOnePostQuery, GetOnePostQueryVariables>(GetOnePostDocument, options);
      }
export function useGetOnePostLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOnePostQuery, GetOnePostQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOnePostQuery, GetOnePostQueryVariables>(GetOnePostDocument, options);
        }
export type GetOnePostQueryHookResult = ReturnType<typeof useGetOnePostQuery>;
export type GetOnePostLazyQueryHookResult = ReturnType<typeof useGetOnePostLazyQuery>;
export type GetOnePostQueryResult = Apollo.QueryResult<GetOnePostQuery, GetOnePostQueryVariables>;
export const GetPostsDocument = gql`
    query GetPosts {
  getPosts {
    ...PostFields
  }
}
    ${PostFieldsFragmentDoc}`;

/**
 * __useGetPostsQuery__
 *
 * To run a query within a React component, call `useGetPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPostsQuery(baseOptions?: Apollo.QueryHookOptions<GetPostsQuery, GetPostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPostsQuery, GetPostsQueryVariables>(GetPostsDocument, options);
      }
export function useGetPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPostsQuery, GetPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPostsQuery, GetPostsQueryVariables>(GetPostsDocument, options);
        }
export type GetPostsQueryHookResult = ReturnType<typeof useGetPostsQuery>;
export type GetPostsLazyQueryHookResult = ReturnType<typeof useGetPostsLazyQuery>;
export type GetPostsQueryResult = Apollo.QueryResult<GetPostsQuery, GetPostsQueryVariables>;
export const GetProfileDocument = gql`
    query GetProfile($userId: ID!) {
  getProfileByUserId(userId: $userId) {
    ...RegularProfile
  }
}
    ${RegularProfileFragmentDoc}`;

/**
 * __useGetProfileQuery__
 *
 * To run a query within a React component, call `useGetProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetProfileQuery(baseOptions: Apollo.QueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
      }
export function useGetProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
        }
export type GetProfileQueryHookResult = ReturnType<typeof useGetProfileQuery>;
export type GetProfileLazyQueryHookResult = ReturnType<typeof useGetProfileLazyQuery>;
export type GetProfileQueryResult = Apollo.QueryResult<GetProfileQuery, GetProfileQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const MyProfileDocument = gql`
    query MyProfile {
  myProfile {
    ...RegularProfile
  }
}
    ${RegularProfileFragmentDoc}`;

/**
 * __useMyProfileQuery__
 *
 * To run a query within a React component, call `useMyProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyProfileQuery(baseOptions?: Apollo.QueryHookOptions<MyProfileQuery, MyProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyProfileQuery, MyProfileQueryVariables>(MyProfileDocument, options);
      }
export function useMyProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyProfileQuery, MyProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyProfileQuery, MyProfileQueryVariables>(MyProfileDocument, options);
        }
export type MyProfileQueryHookResult = ReturnType<typeof useMyProfileQuery>;
export type MyProfileLazyQueryHookResult = ReturnType<typeof useMyProfileLazyQuery>;
export type MyProfileQueryResult = Apollo.QueryResult<MyProfileQuery, MyProfileQueryVariables>;