
// versioon one only works for the settigns page 
// // src/i18n.js

// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';

// // Define your translations
// const resources = {
//   en: {
//     translation: {
//       "Welcome": "Welcome",
//       "Freeze Your Account": "Freeze Your Account",
//       "You can unfreeze your account anytime by logging in.": "You can unfreeze your account anytime by logging in.",
//       "Freeze": "Freeze"
//       // Add more translations here
//     }
//   },
//   zh: {
//     translation: {
//       "Welcome": "欢迎",
//       "Freeze Your Account": "冻结您的帐户",
//       "You can unfreeze your account anytime by logging in.": "您可以随时通过登录解冻帐户。",
//       "Freeze": "冻结"
//       // Add more translations here
//     }
//   }
// };

// i18n
//   .use(initReactI18next)
//   .init({
//     resources,
//     lng: "en", // Default language
//     interpolation: {
//       escapeValue: false
//     }
//   });

// export default i18n;


// version two trail 
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Define your translations
const resources = {
  en: {
    translation: {
      // User Header Component
      "Welcome": "Welcome",
      "Freeze Your Account": "Freeze Your Account",
      "You can unfreeze your account anytime by logging in.": "You can unfreeze your account anytime by logging in.",
      "Freeze": "Freeze",
      "Edit Profile": "Edit Profile",
      "Unfollow": "Unfollow",
      "Follow": "Follow",
      "Copy link": "Copy link",
      "Profile link copied.": "Profile link copied.",
      "Feed": "Feed",
      "Pear": "Pear",
      "meet.com": "meet.com",

      // Post Component
      "Delete Post": "Delete Post",  // Confirmation for deleting post
      "Are you sure you want to delete this post?": "Are you sure you want to delete this post?",  // Delete confirmation prompt
      "Post deleted": "Post deleted",  // Toast message for successful deletion
      "Error deleting post": "Error deleting post",  // Error message
      "ago": "ago",  // Used for time formatting

      // UserPost Component Translations
      "replies": "replies",
      "likes": "likes",
      "1d": "1d", // Keep the time format consistent
      "markzuckerberg": "Mark Zuckerberg",
      "Post Title Placeholder": "This is a post title placeholder",

      // Actions Component Translations
      "Like": "Like",
      "Comment": "Comment",
      "Repost": "Repost",
      "Share": "Share",
      "Error": "Error",
      "Success": "Success",
      "You must be logged in to like a post": "You must be logged in to like a post",
      "You must be logged in to reply to a post": "You must be logged in to reply to a post",
      "Reply": "Reply",
      "Reply posted successfully": "Reply posted successfully",
      "Reply goes here...": "Reply goes here...",

      //  create post translations
      "Create Post": "Create Post",
      "Post content goes here..": "Post content goes here..",
      "Post": "Post",
      "Post created successfully": "Post created successfully",
      "Error": "Error",
      "Error creating post": "Error creating post",

      // message translations
      "Error": "Error",
      "Are you sure you want to delete this post?": "Are you sure you want to delete this post?",
      "Error deleting post": "Error deleting post",
      "Success": "Success",
      "Post deleted": "Post deleted",
      "ago": "ago",
      "Message contains inappropriate content and was not sent.": "Message contains inappropriate content and was not sent.",
      "Delete message": "Delete message",
      "Message image": "Message image",

      // chat page translations
      "Your Conversations": "Your Conversations",
      "Search for a user": "Search for a user",
      "Error": "Error",
      "You cannot message yourself": "You cannot message yourself",
      "Select a conversation to start messaging": "Select a conversation to start messaging",
      "ago": "ago",
      "Error deleting post": "Error deleting post",
      "Are you sure you want to delete this post?": "Are you sure you want to delete this post?",
      "Success": "Success",
      "Post deleted": "Post deleted",

      // post page component 
      "Error": "Error",
      "Success": "Success",
      "Post deleted": "Post deleted",
      "Are you sure you want to delete this post?": "Are you sure you want to delete this post?",
      "Error deleting post": "Error deleting post",
      "ago": "ago",
      "The application is coming to your phone soon.": "The application is coming to your phone soon.",
      "Loading": "Loading...",
      "Delete post confirmation": "Are you sure you want to delete this post?",
      "No post found": "No post found.",
      "Unable to load post": "Unable to load post.",
      "Replies": "Replies",
      "Post": "Post",
      "Like": "Like",
      "Unlike": "Unlike",
      "Comment": "Comment",
      "Share": "Share",
      // trnalstions for home page
      "Error": "Error",
      "New to you!": "New to you!",
      "Welcome to Pear! You have successfully created an account. Log in to see the latest Brookhouse news.": "Welcome to Pear! You have successfully created an account. Log in to see the latest Brookhouse news.",
      // translations for the update profile page 
      "User Profile Edit": "Edit Profile",
      "Change Avatar": "Change Avatar",
      "Full name": "Full name",
      "John Doe": "John Doe",
      "User name": "Username",
      "johndoe": "johndoe",
      "Email address": "Email address",
      "your-email@example.com": "your-email@example.com",
      "Bio": "Bio",
      "Your bio.": "Your bio.",
      "Password": "Password",
      "password": "password",
      "Cancel": "Cancel",
      "Submit": "Submit",
      "Profile updated successfully": "Profile updated successfully",
      "Error updating profile": "Error updating profile",
      "steep": "steep",
      // translations for create post
      "Add Reply": "Add Reply", 
      "Add Image": "Add Image",
       // Settings Page Translations
       "Email Notifications": "Email Notifications",
       "enabled": "enabled",
       "disabled": "disabled",
       "Receive email notifications for new posts": "Receive email notifications for new posts",
       "Email notifications are disabled": "Email notifications are disabled",
       "Are you sure you want to freeze your account?": "Are you sure you want to freeze your account?",
       "Your account has been frozen": "Your account has been frozen",
 
    } 
  },
  zh: {
    translation: {
      // User Header Component
      "Welcome": "欢迎",
      "Freeze Your Account": "冻结您的帐户",
      "You can unfreeze your account anytime by logging in.": "您可以随时通过登录解冻帐户。",
      "Freeze": "冻结",
      "Edit Profile": "编辑资料",
      "Unfollow": "取消关注",
      "Follow": "关注",
      "Copy link": "复制链接",
      "Profile link copied.": "资料链接已复制。",
      "Feed": "动态",
      "Pear": "梨",
      "meet.com": "meet.com",

      // Post Component
      "Delete Post": "删除帖子",  // Confirmation for deleting post
      "Are you sure you want to delete this post?": "您确定要删除此帖子吗？",  // Delete confirmation prompt
      "Post deleted": "帖子已删除",  // Toast message for successful deletion
      "Error deleting post": "删除帖子时出错",  // Error message
      "ago": "前",  // Used for time formatting
      // UserPost Component Translations
      "replies": "回复",
      "likes": "点赞",
      "1d": "1天前",
      "markzuckerberg": "马克·扎克伯格",
      "Post Title Placeholder": "这是一个帖子标题占位符",

      // Actions Component Translations
      "Like": "点赞",
      "Comment": "评论",
      "Repost": "转发",
      "Share": "分享",
      "Error": "错误",
      "Success": "成功",
      "You must be logged in to like a post": "您必须登录才能点赞",
      "You must be logged in to reply to a post": "您必须登录才能回复帖子",
      "Reply": "回复",
      "Reply posted successfully": "回复发布成功",
      "Reply goes here...": "请输入回复内容...",

      //  create post component 
      "Create Post": "创建帖子",
      "Post content goes here..": "帖子内容在这里...",
      "Post": "发布",
      "Post created successfully": "帖子成功发布",
      "Error": "错误",
      "Error creating post": "创建帖子时出错",

      // message translations
      "Error": "错误",
      "Are you sure you want to delete this post?": "你确定要删除这篇帖子吗？",
      "Error deleting post": "删除帖子时出错",
      "Success": "成功",
      "Post deleted": "帖子已删除",
      "ago": "之前",
      "Message contains inappropriate content and was not sent.": "消息包含不适当内容，未发送。",
      "Delete message": "删除消息",
      "Message image": "消息图片",

      // chatpage translations
      "Your Conversations": "您的对话",
      "Search for a user": "搜索用户",
      "Error": "错误",
      "You cannot message yourself": "您不能给自己发消息",
      "Select a conversation to start messaging": "选择一个对话开始消息",
      "ago": "前",
      "Error deleting post": "删除帖子时出错",
      "Are you sure you want to delete this post?": "您确定要删除此帖子吗？",
      "Success": "成功",
      "Post deleted": "帖子已删除",

      // post page component 
      "Error": "错误",
      "Success": "成功",
      "Post deleted": "帖子已删除",
      "Are you sure you want to delete this post?": "您确定要删除此帖子吗？",
      "Error deleting post": "删除帖子时出错",
      "ago": "前",
      "The application is coming to your phone soon.": "应用程序即将登陆您的手机。",
      "Loading": "加载中...",
      "Delete post confirmation": "您确定要删除此帖子吗？",
      "No post found": "未找到帖子。",
      "Unable to load post": "无法加载帖子。",
      "Replies": "回复",
      "Post": "帖子",
      "Like": "赞",
      "Unlike": "取消赞",
      "Comment": "评论",
      "Share": "分享",
      // transaltions for the home page 
      "Error": "错误",
      "New to you!": "新消息！",
      "Welcome to Pear! You have successfully created an account. Log in to see the latest Brookhouse news.": "欢迎使用 Pear！您已成功创建账户。登录以查看最新的 Brookhouse 新闻。",
      // trnalstions for the update profile page 
      "User Profile Edit": "编辑个人资料",
      "Change Avatar": "更改头像",
      "Full name": "全名",
      "John Doe": "约翰·多伊",
      "User name": "用户名",
      "johndoe": "约翰多伊",
      "Email address": "电子邮件地址",
      "your-email@example.com": "你的邮箱@example.com",
      "Bio": "简介",
      "Your bio.": "您的简介。",
      "Password": "密码",
      "password": "密码",
      "Cancel": "取消",
      "Submit": "提交",
      "Profile updated successfully": "个人资料更新成功",
      "Error updating profile": "更新个人资料时出错",
      // this is adding create post tranalsitons 
      "Add Reply": "添加回复", 
      "Add Image": "添加图片",
       // Settings Page Translations
       "Email Notifications": "电子邮件通知",
       "enabled": "已启用",
       "disabled": "已禁用",
       "Receive email notifications for new posts": "接收新帖子的电子邮件通知",
       "Email notifications are disabled": "电子邮件通知已禁用",
       "Are you sure you want to freeze your account?": "您确定要冻结您的帐户吗？",
       "Your account has been frozen": "您的帐户已被冻结",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Default language
    fallbackLng: "en", // Fallback language
    interpolation: {
      escapeValue: false
    },
    debug: true // Enable debug mode
  });

export default i18n;
