import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { BlogStatus } from "../enum/status.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { BlolgLikesEntity } from "./like.entity";
import { BlolgBookmarkEntity } from "./bookmark.entity";
import { BlogCommentEntity } from "./comment.entity";
import { BlogCategoryEntity } from "./blog-category.entity";

@Entity(EntityNames.Blog)
export class BlogEntity extends BaseEntity {
    @Column()
    title: string

    @Column()
    description: string

    @Column()
    content: string

    @Column({ nullable: true })
    image: string

    @Column({ unique: true })
    slug: string

    @Column()
    time_for_study: string

    @Column({ default: BlogStatus.Draft, enum: BlogStatus })
    status: string

    @Column()
    authorId: number

    @ManyToOne(() => UserEntity, user => user.blogs, { onDelete: "CASCADE" })
    author: UserEntity

    @OneToMany(() => BlolgBookmarkEntity, bookmark => bookmark.blog)
    bookmarks: BlolgBookmarkEntity[]

    @OneToMany(() => BlolgLikesEntity, like => like.blog)
    likes: BlolgLikesEntity[]

    @OneToMany(() => BlogCommentEntity, comment => comment.blog)
    comments: BlolgLikesEntity[]

    @OneToMany(() => BlogCategoryEntity, category => category.blog)
    categories: BlogCategoryEntity[]

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}