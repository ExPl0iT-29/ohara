from enum import Enum


class ContentType(str, Enum):
    BLOG = "blog"
    WEBSITE = "website"
    DOCUMENTATION = "documentation"
    PDF = "pdf"
    PAPER = "paper"
    YOUTUBE = "youtube"
    GITHUB = "github"
    BOOK = "book"
    TWEET = "tweet"
    REDDIT = "reddit"
    OTHER = "other"


class ContentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    READY = "ready"
    FAILED = "failed"
