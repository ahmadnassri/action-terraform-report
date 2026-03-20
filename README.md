# GitHub Action: Terraform Pull Request Report Generator

Updates Pull Requests with visual diff of Terraform Plan changes

[![license][license-img]][license-url]
[![release][release-img]][release-url]

## Usage

``` yaml
name: terraform-plan

on:
  pull_request:

jobs:
  terraform-plan:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
        with:
          terraform_wrapper: false

      - run: terraform init
      - run: terraform plan -lock=false -out terraform.plan

      # generate plain output
      - run: terraform show -no-color terraform.plan > terraform.text

      # generate json output
      - run: terraform show -json terraform.plan > terraform.json

      - uses: ahmadnassri/action-terraform-report@v4
        with:
          # tell the action the plan outputs
          terraform-text: ${{ github.workspace }}/terraform.text
          terraform-json: ${{ github.workspace }}/terraform.json
```

> **Note**: Ensure `terraform_wrapper` is set to `false` to better capture the output into a file *(or use your own method)*

### Inputs

| input                  | required | default                      | description                                                                        |
|------------------------|----------|------------------------------|------------------------------------------------------------------------------------|
| `terraform-text`       | ✅       | `-`                          | path to the file resulting from the output of `terraform show /path/to/plan`       |
| `terraform-json`       | ✅       | `-`                          | path to the file resulting from the output of `terraform show -json /path/to/plan` |
| `github-token`         | ❌       | `github.token`               | The GitHub token used to post comments on pull requests                            |
| `custom-header`        | ❌       | `:robot: *Terraform Report*` | custom header text for the github comment                                          |
| `custom-footer`        | ❌       | `-`                          | custom footer text for the github comment                                          |
| `show-header`          | ❌       | `false`                      | include header in the comment?                                                     |
| `show-footer`          | ❌       | `false`                      | include footer in the comment?                                                     |
| `show-plan`            | ❌       | `true`                       | include the terraform plan view in the comment?                                    |
| `show-diff`            | ❌       | `false`                      | include the diff view in the comment?                                              |
| `remove-stale-reports` | ❌       | `true`                       | remove report comments for old commits?                                            |

## Examples

| Pull Request Comment *(default)* |
|----------------------------------|
| ![][1]                           |

| Pull Request Comment *(Plan)* |
|-------------------------------|
| ![][2]                        |

| Pull Request Comment *(Diff)* |
|-------------------------------|
| ![][3]                        |

  [1]: ./docs/1.png
  [2]: ./docs/2.png
  [3]: ./docs/3.png

---

> Author: [Ahmad Nassri](https://www.ahmadnassri.com/)

[license-url]: LICENSE
[license-img]: https://badgen.net/github/license/ahmadnassri/action-terraform-report
[release-url]: https://github.com/ahmadnassri/action-terraform-report/releases
[release-img]: https://badgen.net/github/release/ahmadnassri/action-terraform-report
