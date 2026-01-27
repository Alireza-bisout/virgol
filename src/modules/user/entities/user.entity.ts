import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, UpdateDateColumn } from "typeorm";
import { OtpEntity } from "./otp.entity";
import { ProfileEntity } from "./profile.entity";
import { BlogEntity } from "src/modules/blog/entities/blog.entity";
import { BlolgLikesEntity } from "src/modules/blog/entities/like.entity";
import { BlolgBookmarkEntity } from "src/modules/blog/entities/bookmark.entity";
import { BlogCommentEntity } from "src/modules/blog/entities/comment.entity";
import { ImageEntity } from "src/modules/image/entities/image.entity";

@Entity(EntityNames.User)
export class UserEntity extends BaseEntity {

    @Column({ unique: true, nullable: true })
    username: string;

    @Column({ unique: true, nullable: true })
    phone: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ nullable: true })
    new_email: string;

    @Column({ nullable: true })
    new_phone: string;

    @Column({ nullable: true, default: false })
    verify_email: boolean;

    @Column({ nullable: true, default: false })
    verify_phone: boolean;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    otpId: number;

    @OneToOne(() => OtpEntity, (otp) => otp.user, { nullable: true })
    @JoinColumn({ name: 'otpId' })
    otp: OtpEntity

    @Column({ nullable: true })
    profileId: number;

    @OneToOne(() => OtpEntity, (profile) => profile.user, { nullable: true })
    @JoinColumn({ name: 'profileId' })
    profile: ProfileEntity

    @OneToMany(() => BlogEntity, blog => blog.author)
    blogs: BlogEntity[]

    @OneToMany(() => BlogCommentEntity, blog => blog.user)
    blog_comments: BlogCommentEntity[]

    @OneToMany(() => BlogCommentEntity, image => image.user)
    images: ImageEntity[]

    @OneToMany(() => BlolgLikesEntity, like => like.user)
    blog_likes: BlolgLikesEntity[]

    @OneToMany(() => BlolgBookmarkEntity, bookmark => bookmark.user)
    blog_bookmarks: BlolgBookmarkEntity[]

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}