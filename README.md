# GitHub Action: Terraform Pull Request Report Generator

[![license][license-img]][license-url]
[![version][version-img]][version-url]
[![super linter][super-linter-img]][super-linter-url]
[![release][release-img]][release-url]

[license-url]: LICENSE
[license-img]: https://badgen.net/github/license/ahmadnassri/action-terraform-report

[version-url]: https://github.com/ahmadnassri/action-terraform-report/releases
[version-img]: https://badgen.net//github/release/ahmadnassri/action-terraform-report

[super-linter-url]: https://github.com/ahmadnassri/action-terraform-report/actions?query=workflow%3Asuper-linter
[super-linter-img]: https://github.com/ahmadnassri/action-terraform-report/workflows/super-linter/badge.svg

[release-url]: https://github.com/ahmadnassri/action-terraform-report/actions?query=workflow%3Arelease
[release-img]: https://github.com/ahmadnassri/action-terraform-report/workflows/release/badge.svg

Updates Pull Requests with visual diff of Terraform Plan changes

## Usage

```yaml
name: terraform-plan

on:
  pull_request:

jobs:
  terraform-plan:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - uses: hashicorp/setup-terraform@v1
        with:
          terraform_wrapper: false

      - run: terraform init
      - run: terraform plan -lock=false -out terraform.plan

      # generate plain output
      - run: terraform show -no-color terraform.plan > terraform.text

      # generate json output
      - run: terraform show -json terraform.plan > terraform.json

      - uses: ahmadnassri/action-terraform-report@v2
        with:
          # tell the action the plan outputs
          terraform-text: ${{ github.workspace }}/terraform.text
          terraform-json: ${{ github.workspace }}/terraform.json
```

> **Note**: Ensure `terraform_wrapper` is set to `false` to better capture the output into a file _(or use your own method)_

### Inputs

| input            | required | default        | description                                                                           |
| ---------------- | -------- | -------------- | ------------------------------------------------------------------------------------- |
| `terraform-text` | ✔        | `-`            | path to the file resulting from the output of `terraform show /path/to/plan`          |
| `terraform-json` | ✔        | `-`            | path to the file resulting from the output of `terraform show -json /path/to/plan`    |
| `github-token`   | ❌       | `github.token` | The GitHub token used to post comments on pull requests                               |

