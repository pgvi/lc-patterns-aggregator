package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestLoadProblems(t *testing.T) {
	type testCase struct {
		problemsFile string
		want         []Problem
		wantErr      bool
	}
	tests := map[string]testCase{
		"file exists": {
			problemsFile: "testdata/problem/leetcode.json",
			want: []Problem{
				{"1", "Two Sum", "Easy", false, "https://leetcode.com/problems/two-sum/", []string{"Array", "Hash Table"}},
				{"3608", "Minimum Time for K Connected Components", "Medium", false, "https://leetcode.com/problems/minimum-time-for-k-connected-components/", []string{"Binary Search", "Union Find", "Graph", "Sorting"}},
			},
			wantErr: false,
		},
		"file doesn't exist": {
			problemsFile: "testdata/problem/no_file_here.json",
			want:         nil,
			wantErr:      true,
		},
		"invalid JSON": {
			problemsFile: "testdata/problem/leetcode_invalid.json",
			want:         nil,
			wantErr:      true,
		},
	}
	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			got, err := loadProblems(tc.problemsFile)

			if tc.wantErr {
				if err == nil {
					t.Fatal("expected err, got nothing")
				}
				return
			}

			// we aren't expecting errors here, this should be the happy path
			if err != nil {
				t.Fatalf("expected no error, got %v", err)
			}

			assert.Equal(t, tc.want, got, "different result: got %v, expected %v", got, tc.want)
		})
	}
}

func TestLoadLists(t *testing.T) {
	type testCase struct {
		listsDirPath string
		want         []FullSource
		wantErr      bool
	}

	tests := map[string]testCase{
		"no sources in dir": {
			"testdata/lists/empty",
			nil,
			true,
		},
		"invalid sources in dir": {
			"testdata/lists/invalid",
			nil,
			true,
		},
		"sources in dir": {
			"testdata/lists/sources",
			[]FullSource{
				{
					Source:   Source{Id: "unknown", Title: "unknown", URL: "https://leetcode.com/problem-list/unkown-abcdefghi123/"},
					Problems: []string{"128", "252", "121", "124", "125"},
				},
				{
					Source:   Source{Id: "unknown 2", Title: "unknown2", URL: "https://leetcode.com/problem-list/unkown-abcdefghi123/"},
					Problems: []string{"124", "125"},
				},
			},
			false,
		},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			got, err := loadLists(tc.listsDirPath)

			if tc.wantErr {
				t.Log(err)
				if err == nil {
					t.Fatal("expected err, got nothing")
				}
				return
			}

			if err != nil {
				t.Fatalf("expected no error, got %v", err)
			}
			assert.Equal(t, tc.want, got, "different result: got %v, expected %v", got, tc.want)
		})
	}
}
