# repositories @ v1

## Resource repositories@v1
* **Valid Scope(s)**: Unknown
### Properties
* **allow_auto_merge**: bool: Either `true` to allow auto-merge on pull requests, or `false` to disallow auto-merge.
* **allow_merge_commit**: bool: Either `true` to allow merging pull requests with a merge commit, or `false` to prevent merging pull requests with merge commits.
* **allow_rebase_merge**: bool: Either `true` to allow rebase-merging pull requests, or `false` to prevent rebase-merging.
* **allow_squash_merge**: bool: Either `true` to allow squash-merging pull requests, or `false` to prevent squash-merging.
* **auto_init**: bool: Pass `true` to create an initial commit with empty README.
* **delete_branch_on_merge**: bool: Either `true` to allow automatically deleting head branches when pull requests are merged, or `false` to prevent automatic deletion.
* **description**: string: A short description of the repository.
* **gitignore_template**: string: Desired language or platform [.gitignore template](https://github.com/github/gitignore) to apply. Use the name of the template without the extension. For example, "Haskell".
* **has_issues**: bool: Either `true` to enable issues for this repository or `false` to disable them.
* **has_projects**: bool: Either `true` to enable projects for this repository or `false` to disable them. **Note:** If you're creating a repository in an organization that has disabled repository projects, the default is `false`, and if you pass `true`, the API returns an error.
* **has_wiki**: bool: Either `true` to enable the wiki for this repository or `false` to disable it.
* **homepage**: string: A URL with more information about the repository.
* **is_template**: bool: Either `true` to make this repo available as a template repository or `false` to prevent it.
* **license_template**: string: Choose an [open source license template](https://choosealicense.com/) that best suits your needs, and then use the [license keyword](https://docs.github.com/articles/licensing-a-repository/#searching-github-by-license-type) as the `license_template` string. For example, "mit" or "mpl-2.0".
* **merge_commit_message**: 'BLANK' | 'PR_BODY' | 'PR_TITLE': The default value for a merge commit message.

- `PR_TITLE` - default to the pull request's title.
- `PR_BODY` - default to the pull request's body.
- `BLANK` - default to a blank commit message.
* **merge_commit_title**: 'MERGE_MESSAGE' | 'PR_TITLE': The default value for a merge commit title.

- `PR_TITLE` - default to the pull request's title.
- `MERGE_MESSAGE` - default to the classic title for a merge message (e.g., Merge pull request #123 from branch-name).
* **name**: string (Required): The name of the repository.
* **org**: string: The name of the organization.
* **private**: bool: Whether the repository is private.
* **squash_merge_commit_message**: 'BLANK' | 'COMMIT_MESSAGES' | 'PR_BODY': The default value for a squash merge commit message:

- `PR_BODY` - default to the pull request's body.
- `COMMIT_MESSAGES` - default to the branch's commit messages.
- `BLANK` - default to a blank commit message.
* **squash_merge_commit_title**: 'COMMIT_OR_PR_TITLE' | 'PR_TITLE': The default value for a squash merge commit title:

- `PR_TITLE` - default to the pull request's title.
- `COMMIT_OR_PR_TITLE` - default to the commit's title (if only one commit) or the pull request's title (when more than one commit).
* **team_id**: int: The id of the team that will be granted access to this repository. This is only valid when creating a repository in an organization.
* **visibility**: 'internal' | 'private' | 'public': Can be `public` or `private`. If your organization is associated with an enterprise account using GitHub Enterprise Cloud or GitHub Enterprise Server 2.20+, `visibility` can also be `internal`. Note: For GitHub Enterprise Server and GitHub AE, this endpoint will only list repositories available to all users on the enterprise. For more information, see "[Creating an internal repository](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/about-repository-visibility#about-internal-repositories)" in the GitHub Help documentation.

