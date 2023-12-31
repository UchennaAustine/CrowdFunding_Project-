-- CreateTable
CREATE TABLE "abegs" (
    "id" STRING NOT NULL,
    "userID" STRING NOT NULL,
    "title" STRING NOT NULL,
    "motivation" STRING NOT NULL,
    "detailDescription" STRING NOT NULL,
    "amountNeeded" INT4 NOT NULL,
    "amountRaised" INT4 NOT NULL,
    "picture" STRING NOT NULL,
    "pictureID" STRING NOT NULL,
    "category" STRING NOT NULL,
    "givers" JSONB NOT NULL,
    "love" STRING[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "abegs_pkey" PRIMARY KEY ("id")
);
