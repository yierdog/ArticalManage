
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 10/08/2024 19:28:07
-- Generated from EDMX file: D:\桌面\NET Framework\WebApplication23\Model1.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [final];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------


-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[answer]', 'U') IS NOT NULL
    DROP TABLE [dbo].[answer];
GO
IF OBJECT_ID(N'[dbo].[code1]', 'U') IS NOT NULL
    DROP TABLE [dbo].[code1];
GO
IF OBJECT_ID(N'[dbo].[concern]', 'U') IS NOT NULL
    DROP TABLE [dbo].[concern];
GO
IF OBJECT_ID(N'[dbo].[taking]', 'U') IS NOT NULL
    DROP TABLE [dbo].[taking];
GO
IF OBJECT_ID(N'[dbo].[user_table]', 'U') IS NOT NULL
    DROP TABLE [dbo].[user_table];
GO
IF OBJECT_ID(N'[finalModelStoreContainer].[filename]', 'U') IS NOT NULL
    DROP TABLE [finalModelStoreContainer].[filename];
GO
IF OBJECT_ID(N'[finalModelStoreContainer].[menus]', 'U') IS NOT NULL
    DROP TABLE [finalModelStoreContainer].[menus];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'answer'
CREATE TABLE [dbo].[answer] (
    [id] int IDENTITY(1,1) NOT NULL,
    [contment] varchar(max)  NULL,
    [comment_author] varchar(50)  NULL,
    [time] varchar(50)  NULL,
    [comment_id] varchar(50)  NULL
);
GO

-- Creating table 'concern'
CREATE TABLE [dbo].[concern] (
    [id] int IDENTITY(1,1) NOT NULL,
    [author] varchar(50)  NULL,
    [con] varchar(max)  NULL
);
GO

-- Creating table 'taking'
CREATE TABLE [dbo].[taking] (
    [id] int IDENTITY(1,1) NOT NULL,
    [cont] varchar(max)  NOT NULL,
    [comment_author] varchar(50)  NULL,
    [title] varchar(50)  NULL,
    [time] varchar(50)  NULL
);
GO

-- Creating table 'user_table'
CREATE TABLE [dbo].[user_table] (
    [id] int IDENTITY(1,1) NOT NULL,
    [name] varchar(50)  NOT NULL,
    [password] varchar(50)  NOT NULL,
    [role] varchar(50)  NULL,
    [privilege] varchar(max)  NULL
);
GO

-- Creating table 'filename'
CREATE TABLE [dbo].[filename] (
    [id] varchar(max)  NOT NULL,
    [file_name] varchar(max)  NULL,
    [newfilename] varchar(max)  NULL,
    [uploadpath] varchar(max)  NULL
);
GO

-- Creating table 'code1'
CREATE TABLE [dbo].[code1] (
    [ArticleID] int IDENTITY(1,1) NOT NULL,
    [ArticleTitle] varchar(50)  NULL,
    [ArticleContent] varchar(max)  NULL,
    [Author] varchar(50)  NULL,
    [type] varchar(50)  NULL,
    [time] datetime  NULL,
    [filename] varchar(max)  NULL,
    [image] varchar(max)  NULL
);
GO

-- Creating table 'menus'
CREATE TABLE [dbo].[menus] (
    [id] int IDENTITY(1,1) NOT NULL,
    [url] varchar(50)  NULL,
    [title] varchar(50)  NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [id] in table 'answer'
ALTER TABLE [dbo].[answer]
ADD CONSTRAINT [PK_answer]
    PRIMARY KEY CLUSTERED ([id] ASC);
GO

-- Creating primary key on [id] in table 'concern'
ALTER TABLE [dbo].[concern]
ADD CONSTRAINT [PK_concern]
    PRIMARY KEY CLUSTERED ([id] ASC);
GO

-- Creating primary key on [id] in table 'taking'
ALTER TABLE [dbo].[taking]
ADD CONSTRAINT [PK_taking]
    PRIMARY KEY CLUSTERED ([id] ASC);
GO

-- Creating primary key on [id] in table 'user_table'
ALTER TABLE [dbo].[user_table]
ADD CONSTRAINT [PK_user_table]
    PRIMARY KEY CLUSTERED ([id] ASC);
GO

-- Creating primary key on [id] in table 'filename'
ALTER TABLE [dbo].[filename]
ADD CONSTRAINT [PK_filename]
    PRIMARY KEY CLUSTERED ([id] ASC);
GO

-- Creating primary key on [ArticleID] in table 'code1'
ALTER TABLE [dbo].[code1]
ADD CONSTRAINT [PK_code1]
    PRIMARY KEY CLUSTERED ([ArticleID] ASC);
GO

-- Creating primary key on [id] in table 'menus'
ALTER TABLE [dbo].[menus]
ADD CONSTRAINT [PK_menus]
    PRIMARY KEY CLUSTERED ([id] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------